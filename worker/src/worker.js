import Redis from 'ioredis'

const redisHost = process.env.REDIS_HOST || 'redis'
const redisPort = process.env.REDIS_PORT || 6379

const redis = new Redis({
  host: redisHost,
  port: redisPort,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  }
})

const TASK_QUEUE = 'task:notifications'

async function processTask(task) {
  console.log(`[Worker] Processing notification for task: ${task.id}`)
  console.log(`[Worker] Title: ${task.title}`)
  console.log(`[Worker] Status: ${task.status}`)

  // Simulate email/notification sending
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log(`[Worker] Notification sent successfully for task: ${task.id}`)
  return true
}

async function startWorker() {
  console.log(`[Worker] Starting notification worker...`)
  console.log(`[Worker] Connected to Redis at ${redisHost}:${redisPort}`)

  redis.subscribe(TASK_QUEUE, (err) => {
    if (err) {
      console.error('[Worker] Failed to subscribe:', err)
      process.exit(1)
    }
    console.log(`[Worker] Subscribed to queue: ${TASK_QUEUE}`)
  })

  redis.on('message', async (channel, message) => {
    try {
      const task = JSON.parse(message)
      await processTask(task)
    } catch (err) {
      console.error('[Worker] Error processing message:', err.message)
    }
  })

  redis.on('error', (err) => {
    console.error('[Worker] Redis error:', err.message)
  })

  console.log('[Worker] Worker is ready and waiting for tasks...')
}

startWorker()

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Worker] Shutting down...')
  redis.quit()
  process.exit(0)
})
