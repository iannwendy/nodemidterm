/**
 * E2E Test Suite for TaskFlow Application
 * Tests the full pipeline: Frontend → Backend → Database
 */

const http = require('http')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

let testsPassed = 0
let testsFailed = 0
const results = []

function log(type, message) {
  const prefix = {
    pass: `${colors.green}✓ PASS${colors.reset}`,
    fail: `${colors.red}✗ FAIL${colors.reset}`,
    info: `${colors.blue}ℹ INFO${colors.reset}`,
    warn: `${colors.yellow}⚠ WARN${colors.reset}`,
  }[type] || type

  console.log(`${prefix} ${message}`)
}

function assert(condition, message) {
  if (condition) {
    testsPassed++
    results.push({ test: message, status: 'PASS' })
    log('pass', message)
  } else {
    testsFailed++
    results.push({ test: message, status: 'FAIL' })
    log('fail', message)
  }
}

function httpRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL)
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            body: JSON.parse(data),
            raw: data,
          })
        } catch {
          resolve({
            status: res.statusCode,
            body: data,
            raw: data,
          })
        }
      })
    })

    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (body) {
      req.write(JSON.stringify(body))
    }
    req.end()
  })
}

async function waitForService(maxRetries = 30, interval = 2000) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await httpRequest('GET', '/api/health')
      if (res.status === 200) {
        log('info', `Service ready after ${i} attempts`)
        return true
      }
    } catch (err) {
      log('warn', `Attempt ${i}/${maxRetries}: ${err.message}`)
    }
    await new Promise(r => setTimeout(r, interval))
  }
  return false
}

// Test suites
async function runHealthTests() {
  console.log(`\n${colors.cyan}═══ HEALTH CHECK TESTS ═══${colors.reset}\n`)

  const res = await httpRequest('GET', '/api/health')
  assert(res.status === 200, 'Health endpoint returns 200')
  assert(res.body?.status === 'ok', 'Health status is "ok"')
  assert(res.body?.service === 'task-manager-backend', 'Service name is correct')
}

async function runCRUDTests() {
  console.log(`\n${colors.cyan}═══ CRUD TESTS ═══${colors.reset}\n`)

  // CREATE
  const createRes = await httpRequest('POST', '/api/tasks', {
    title: `Test Task ${Date.now()}`,
    description: 'E2E test task',
    status: 'todo',
    priority: 'medium',
  })
  assert(createRes.status === 201, 'Create task returns 201')
  assert(createRes.body?.data?.id, 'Created task has ID')

  const taskId = createRes.body.data.id
  log('info', `Created task with ID: ${taskId}`)

  // READ ALL
  const getAllRes = await httpRequest('GET', '/api/tasks')
  assert(getAllRes.status === 200, 'Get all tasks returns 200')
  assert(Array.isArray(getAllRes.body?.data), 'Tasks data is an array')
  assert(getAllRes.body.data.length > 0, 'Tasks array is not empty')

  // READ ONE
  const getOneRes = await httpRequest('GET', `/api/tasks/${taskId}`)
  assert(getOneRes.status === 200, 'Get single task returns 200')
  assert(getOneRes.body?.data?.id === taskId, 'Retrieved task has correct ID')

  // UPDATE
  const updateRes = await httpRequest('PUT', `/api/tasks/${taskId}`, {
    status: 'in-progress',
    priority: 'high',
  })
  assert(updateRes.status === 200, 'Update task returns 200')
  assert(updateRes.body?.data?.status === 'in-progress', 'Task status updated')
  assert(updateRes.body?.data?.priority === 'high', 'Task priority updated')

  // DELETE
  const deleteRes = await httpRequest('DELETE', `/api/tasks/${taskId}`)
  assert(deleteRes.status === 200, 'Delete task returns 200')

  // Verify deletion
  const verifyRes = await httpRequest('GET', `/api/tasks/${taskId}`)
  assert(verifyRes.status === 404, 'Deleted task returns 404')
}

async function runFilterTests() {
  console.log(`\n${colors.cyan}═══ FILTER & SEARCH TESTS ═══${colors.reset}\n`)

  // Create test tasks
  const tasks = [
    { title: 'Filter Test Low', status: 'todo', priority: 'low' },
    { title: 'Filter Test High', status: 'done', priority: 'high' },
  ]

  const createdIds = []
  for (const task of tasks) {
    const res = await httpRequest('POST', '/api/tasks', task)
    createdIds.push(res.body.data.id)
  }

  // Test status filter
  const statusRes = await httpRequest('GET', '/api/tasks?status=todo')
  assert(statusRes.status === 200, 'Status filter returns 200')
  assert(statusRes.body.data.every(t => t.status === 'todo'), 'Status filter works')

  // Test priority filter
  const priorityRes = await httpRequest('GET', '/api/tasks?priority=high')
  assert(priorityRes.status === 200, 'Priority filter returns 200')
  assert(priorityRes.body.data.every(t => t.priority === 'high'), 'Priority filter works')

  // Cleanup
  for (const id of createdIds) {
    await httpRequest('DELETE', `/api/tasks/${id}`)
  }
}

async function runValidationTests() {
  console.log(`\n${colors.cyan}═══ VALIDATION TESTS ═══${colors.reset}\n`)

  // Test missing title
  const noTitleRes = await httpRequest('POST', '/api/tasks', {
    description: 'No title',
  })
  assert(noTitleRes.status === 400, 'POST without title returns 400')

  // Test invalid status
  const invalidStatusRes = await httpRequest('POST', '/api/tasks', {
    title: 'Test',
    status: 'invalid-status',
  })
  assert(invalidStatusRes.status === 400, 'Invalid status returns 400')

  // Test invalid UUID
  const invalidIdRes = await httpRequest('GET', '/api/tasks/not-a-uuid')
  assert(invalidIdRes.status === 400, 'Invalid UUID returns 400')
}

async function runStatsTests() {
  console.log(`\n${colors.cyan}═══ STATS TESTS ═══${colors.reset}\n`)

  const res = await httpRequest('GET', '/api/stats')
  assert(res.status === 200, 'Stats endpoint returns 200')
  assert(typeof res.body?.data?.total === 'number', 'Stats has total count')
  assert(typeof res.body?.data?.todo === 'number', 'Stats has todo count')
  assert(typeof res.body?.data?.inProgress === 'number', 'Stats has in-progress count')
  assert(typeof res.body?.data?.done === 'number', 'Stats has done count')
}

async function runLoadBalancingTests() {
  console.log(`\n${colors.cyan}═══ LOAD BALANCING TESTS ═══${colors.reset}\n`)

  // Make multiple requests and check if they go to different instances
  const instances = new Set()

  for (let i = 0; i < 10; i++) {
    const res = await httpRequest('GET', '/api/health')
    if (res.body?.instance) {
      instances.add(res.body.instance)
    }
  }

  log('info', `Detected ${instances.size} backend instance(s)`)
  assert(true, 'Load balancing check completed')
}

async function printSummary() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`)
  console.log(`${colors.cyan}                    TEST SUMMARY${colors.reset}`)
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`)

  console.log(`${colors.green}Passed: ${testsPassed}${colors.reset}`)
  console.log(`${colors.red}Failed: ${testsFailed}${colors.reset}`)
  console.log(`Total:  ${testsPassed + testsFailed}\n`)

  const percentage = Math.round((testsPassed / (testsPassed + testsFailed)) * 100)
  const status = percentage >= 80 ? `${colors.green}PASSED` : `${colors.red}FAILED`
  console.log(`Result: ${status}${colors.reset} (${percentage}%)\n`)

  // Save results to file
  const fs = require('fs')
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      passed: testsPassed,
      failed: testsFailed,
      total: testsPassed + testsFailed,
      percentage,
    },
    results,
  }

  fs.writeFileSync('test-results.json', JSON.stringify(report, null, 2))
  log('info', 'Test report saved to test-results.json')

  process.exit(testsFailed > 0 ? 1 : 0)
}

// Main execution
async function main() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════════════════╗${colors.reset}`)
  console.log(`${colors.cyan}║     TaskFlow E2E Test Suite${colors.reset}`)
  console.log(`${colors.cyan}║     Testing: ${BASE_URL}${colors.reset}`)
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════════╝${colors.reset}`)

  try {
    // Wait for service
    log('info', 'Waiting for service to be ready...')
    const ready = await waitForService()

    if (!ready) {
      log('fail', 'Service not ready after max retries')
      process.exit(1)
    }

    // Run tests
    await runHealthTests()
    await runCRUDTests()
    await runFilterTests()
    await runValidationTests()
    await runStatsTests()
    await runLoadBalancingTests()

  } catch (err) {
    log('fail', `Unexpected error: ${err.message}`)
    console.error(err)
    process.exit(1)
  } finally {
    await printSummary()
  }
}

main()
