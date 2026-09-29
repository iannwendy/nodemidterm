import express from 'express'
import database from '../config/database.js'
import { getPublisher } from '../config/redis.js'

const router = express.Router()

// GET /api/health - Comprehensive health check
router.get('/health', async (req, res) => {
  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'task-manager-backend',
    version: '1.0.0',
    checks: {}
  }

  try {
    // Database check
    const startDb = Date.now()
    await database.query('SELECT 1')
    healthcheck.checks.database = {
      status: 'ok',
      responseTime: `${Date.now() - startDb}ms`
    }
  } catch (err) {
    healthcheck.checks.database = {
      status: 'error',
      message: err.message
    }
    healthcheck.status = 'degraded'
  }

  try {
    // Redis check
    const publisher = getPublisher()
    if (publisher && publisher.status === 'ready') {
      const startRedis = Date.now()
      await publisher.ping()
      healthcheck.checks.redis = {
        status: 'ok',
        responseTime: `${Date.now() - startRedis}ms`
      }
    } else {
      healthcheck.checks.redis = {
        status: 'unavailable',
        message: 'Redis not connected'
      }
      // Don't mark as degraded - Redis is optional
    }
  } catch (err) {
    healthcheck.checks.redis = {
      status: 'error',
      message: err.message
    }
  }

  const statusCode = healthcheck.status === 'ok' ? 200 : 503
  res.status(statusCode).json(healthcheck)
})

export default router
