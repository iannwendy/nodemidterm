import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import database from './config/database.js'
import { initRedis } from './config/redis.js'
import taskRoutes from './routes/tasks.js'
import statsRoutes from './routes/stats.js'
import healthRoutes from './routes/health.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request ID middleware
app.use((req, res, next) => {
  req.id = Math.random().toString(36).substring(7)
  res.setHeader('X-Request-ID', req.id)
  next()
})

// Health check endpoint (no DB required)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'task-manager-backend',
    version: '1.0.0',
    instance: process.env.INSTANCE_ID || 'single'
  })
})

// Routes
app.use('/api/tasks', taskRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api', healthRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${req.id}] Error:`, err.message)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    requestId: req.id
  })
})

// Initialize database and start server
async function start() {
  try {
    await database.initialize()
    console.log('✓ Database initialized')

    // Initialize Redis (optional - won't fail if Redis unavailable)
    try {
      initRedis()
      console.log('✓ Redis initialized')
    } catch (err) {
      console.warn('⚠ Redis not available, notifications disabled:', err.message)
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on port ${PORT}`)
      console.log(`  Health: http://localhost:${PORT}/health`)
      console.log(`  API: http://localhost:${PORT}/api`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()

export default app
