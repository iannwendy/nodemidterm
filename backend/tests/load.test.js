import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate, Trend } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')
const requestDuration = new Trend('request_duration')

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up
    { duration: '1m', target: 10 },    // Steady state
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% requests under 500ms
    http_req_failed: ['rate<0.01'],     // Less than 1% failures
    errors: ['rate<0.05'],              // Less than 5% error rate
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export function setup() {
  // Wait for services to be ready
  const maxRetries = 30
  for (let i = 0; i < maxRetries; i++) {
    const res = http.get(`${BASE_URL}/health`)
    if (res.status === 200) {
      console.log('Services are ready!')
      return { ready: true }
    }
    sleep(2)
  }
  console.log('Services did not become ready in time')
  return { ready: false }
}

export default function(data) {
  if (!data.ready) {
    console.log('Skipping test - services not ready')
    return
  }

  const headers = { 'Content-Type': 'application/json' }

  // Test 1: Health check
  const healthRes = http.get(`${BASE_URL}/health`)
  check(healthRes, {
    'health check returns 200': (r) => r.status === 200,
    'health check has correct structure': (r) => JSON.parse(r.body).status === 'ok',
  })

  // Test 2: Get all tasks
  const getTasksRes = http.get(`${BASE_URL}/api/tasks`, { headers })
  check(getTasksRes, {
    'get tasks returns 200': (r) => r.status === 200,
    'get tasks returns array': (r) => Array.isArray(JSON.parse(r.body).data),
  })

  // Test 3: Create task
  const taskPayload = JSON.stringify({
    title: `Load test task ${Date.now()}`,
    description: 'Created by k6 load test',
    status: 'todo',
    priority: 'medium',
  })

  const createRes = http.post(`${BASE_URL}/api/tasks`, taskPayload, { headers })
  const createSuccess = check(createRes, {
    'create task returns 201': (r) => r.status === 201,
    'create task returns task data': (r) => JSON.parse(r.body).data?.id,
  })

  if (createSuccess) {
    const taskId = JSON.parse(createRes.body).data.id

    // Test 4: Get single task
    const getOneRes = http.get(`${BASE_URL}/api/tasks/${taskId}`, { headers })
    check(getOneRes, {
      'get single task returns 200': (r) => r.status === 200,
      'get single task returns correct id': (r) => JSON.parse(r.body).data?.id === taskId,
    })

    // Test 5: Update task
    const updatePayload = JSON.stringify({
      status: 'in-progress',
      priority: 'high',
    })
    const updateRes = http.put(`${BASE_URL}/api/tasks/${taskId}`, updatePayload, { headers })
    check(updateRes, {
      'update task returns 200': (r) => r.status === 200,
      'update task changes status': (r) => JSON.parse(r.body).data?.status === 'in-progress',
    })

    // Test 6: Delete task
    const deleteRes = http.del(`${BASE_URL}/api/tasks/${taskId}`, null, { headers })
    check(deleteRes, {
      'delete task returns 200': (r) => r.status === 200,
    })
  }

  // Test 7: Get stats
  const statsRes = http.get(`${BASE_URL}/api/stats`, { headers })
  check(statsRes, {
    'get stats returns 200': (r) => r.status === 200,
    'get stats has required fields': (r) => {
      const stats = JSON.parse(r.body).data
      return stats.total !== undefined && stats.todo !== undefined
    },
  })

  // Record metrics
  requestDuration.add(getTasksRes.timings.duration)
  if (getTasksRes.status !== 200) {
    errorRate.add(1)
  }
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data, null, 2),
  }
}

function textSummary(data, opts) {
  const indent = opts.indent || ''
  const enableColors = opts.enableColors || false

  let output = '\n' + indent + '='.repeat(50) + '\n'
  output += indent + '  PERFORMANCE TEST RESULTS\n'
  output += indent + '='.repeat(50) + '\n\n'

  // HTTP metrics
  output += indent + 'HTTP Metrics:\n'
  output += indent + '  - Request Duration (avg): ' + data.metrics.http_req_duration.values.avg.toFixed(2) + 'ms\n'
  output += indent + '  - Request Duration (p95): ' + data.metrics.http_req_duration.values['p(95)'].toFixed(2) + 'ms\n'
  output += indent + '  - Failed Requests: ' + (data.metrics.http_req_failed.values.rate * 100).toFixed(2) + '%\n\n'

  // Custom metrics
  if (data.metrics.errors) {
    output += indent + 'Error Rate: ' + (data.metrics.errors.values.rate * 100).toFixed(2) + '%\n\n'
  }

  output += indent + '='.repeat(50) + '\n'

  return output
}
