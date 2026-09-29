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

  redis.on('error', (err) => {
    console.error('[Worker] Redis error:', err.message)
  })

  redis.on('connect', () => {
    console.log('[Worker] Redis connected, waiting for tasks...')
  })

  // Main worker loop - blocking pop from queue
  async function workerLoop() {
    while (true) {
      try {
        // BLPOP: blocking pop from left side of list
        // Waits up to 5 seconds for an item, then returns null if empty
        const result = await redis.blpop(TASK_QUEUE, 5)

        if (result) {
          // result = [queueName, value]
          const message = result[1]
          try {
            const notification = JSON.parse(message)
            console.log(`[Worker] Received notification: ${notification.type}`)

            if (notification.task) {
              await processTask(notification.task)
            }
          } catch (parseErr) {
            console.error('[Worker] Failed to parse notification:', parseErr.message)
          }
        }
        // No result = timeout, continue loop
      } catch (err) {
        if (err.message.includes('SIGTERM') || err.message.includes('shutdown')) {
          console.log('[Worker] Worker loop terminated')
          break
        }
        console.error('[Worker] Error in worker loop:', err.message)
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  // Start the worker loop
  workerLoop()
}

startWorker()

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Worker] Received SIGTERM, shutting down...')
  redis.quit()
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('[Worker] Received SIGINT, shutting down...')
  redis.quit()
  process.exit(0)
})
