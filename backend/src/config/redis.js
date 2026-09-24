import Redis from 'ioredis'

const redisConfig = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
  maxRetriesPerRequest: 3
}

let publisher = null
let subscriber = null

export function initRedis() {
  publisher = new Redis(redisConfig)
  subscriber = new Redis(redisConfig)

  publisher.on('connect', () => {
    console.log('✓ Redis publisher connected')
  })

  publisher.on('error', (err) => {
    console.error('Redis publisher error:', err.message)
  })

  return { publisher, subscriber }
}

export function getPublisher() {
  return publisher
}

export function getSubscriber() {
  return subscriber
}

// Publish task notification to queue
export async function publishTaskNotification(task) {
  if (!publisher) {
    console.warn('Redis not initialized, skipping notification')
    return false
  }

  try {
    const message = JSON.stringify({
      type: 'TASK_NOTIFICATION',
      task: {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority
      },
      timestamp: new Date().toISOString()
    })

    await publisher.lpush('task:notifications', message)
    console.log(`[Redis] Published notification for task: ${task.id}`)
    return true
  } catch (err) {
    console.error('[Redis] Failed to publish notification:', err.message)
    return false
  }
}

export async function closeRedis() {
  if (publisher) await publisher.quit()
  if (subscriber) await subscriber.quit()
}
