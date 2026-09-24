import express from 'express'
import { body, param, validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import database from '../config/database.js'
import { publishTaskNotification } from '../config/redis.js'

const router = express.Router()

// Validation middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// GET /api/tasks - Get all tasks
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, search } = req.query
    let sql = 'SELECT * FROM tasks WHERE 1=1'
    const params = []

    if (status) {
      sql += ' AND status = ?'
      params.push(status)
    }
    if (priority) {
      sql += ' AND priority = ?'
      params.push(priority)
    }
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    sql += ' ORDER BY created_at DESC'
    const tasks = await database.query(sql, params)

    res.json({
      success: true,
      data: tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }))
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/tasks/:id - Get single task
router.get('/:id',
  param('id').isUUID(),
  handleValidation,
  async (req, res, next) => {
    try {
      const tasks = await database.query(
        'SELECT * FROM tasks WHERE id = ?',
        [req.params.id]
      )

      if (tasks.length === 0) {
        return res.status(404).json({ error: 'Task not found' })
      }

      const task = tasks[0]
      res.json({
        success: true,
        data: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          createdAt: task.created_at,
          updatedAt: task.updated_at
        }
      })
    } catch (err) {
      next(err)
    }
  }
)

// POST /api/tasks - Create task
router.post('/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('status').optional().isIn(['todo', 'in-progress', 'done']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { title, description, status = 'todo', priority = 'medium' } = req.body
      const id = uuidv4()

      await database.query(
        'INSERT INTO tasks (id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)',
        [id, title, description, status, priority]
      )

      const tasks = await database.query('SELECT * FROM tasks WHERE id = ?', [id])
      const task = tasks[0]

      res.status(201).json({
        success: true,
        data: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          createdAt: task.created_at,
          updatedAt: task.updated_at
        }
      })

      // Publish notification to Redis queue (async, don't wait)
      publishTaskNotification(task).catch(err => {
        console.error('Failed to publish notification:', err.message)
      })
    } catch (err) {
      next(err)
    }
  }
)

// PUT /api/tasks/:id - Update task
router.put('/:id',
  param('id').isUUID(),
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('status').optional().isIn(['todo', 'in-progress', 'done']),
    body('priority').optional().isIn(['low', 'medium', 'high'])
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const { id } = req.params
      const { title, description, status, priority } = req.body

      // Check if task exists
      const existing = await database.query('SELECT id FROM tasks WHERE id = ?', [id])
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Task not found' })
      }

      // Build update query dynamically
      const updates = []
      const params = []

      if (title !== undefined) {
        updates.push('title = ?')
        params.push(title)
      }
      if (description !== undefined) {
        updates.push('description = ?')
        params.push(description)
      }
      if (status !== undefined) {
        updates.push('status = ?')
        params.push(status)
      }
      if (priority !== undefined) {
        updates.push('priority = ?')
        params.push(priority)
      }

      if (updates.length > 0) {
        params.push(id)
        await database.query(
          `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
          params
        )
      }

      const tasks = await database.query('SELECT * FROM tasks WHERE id = ?', [id])
      const task = tasks[0]

      res.json({
        success: true,
        data: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          createdAt: task.created_at,
          updatedAt: task.updated_at
        }
      })
    } catch (err) {
      next(err)
    }
  }
)

// DELETE /api/tasks/:id - Delete task
router.delete('/:id',
  param('id').isUUID(),
  handleValidation,
  async (req, res, next) => {
    try {
      const { id } = req.params

      const result = await database.query(
        'DELETE FROM tasks WHERE id = ?',
        [id]
      )

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Task not found' })
      }

      res.json({ success: true, message: 'Task deleted' })
    } catch (err) {
      next(err)
    }
  }
)

export default router
