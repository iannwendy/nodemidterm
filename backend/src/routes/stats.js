import express from 'express'
import database from '../config/database.js'

const router = express.Router()

// GET /api/stats - Get dashboard statistics
router.get('/', async (req, res, next) => {
  try {
    const totalResult = await database.query('SELECT COUNT(*) as count FROM tasks')
    const todoResult = await database.query(
      "SELECT COUNT(*) as count FROM tasks WHERE status = 'todo'"
    )
    const inProgressResult = await database.query(
      "SELECT COUNT(*) as count FROM tasks WHERE status = 'in-progress'"
    )
    const doneResult = await database.query(
      "SELECT COUNT(*) as count FROM tasks WHERE status = 'done'"
    )
    const highPriorityResult = await database.query(
      "SELECT COUNT(*) as count FROM tasks WHERE priority = 'high'"
    )
    const recentTasks = await database.query(
      'SELECT id, title, status, priority, created_at FROM tasks ORDER BY created_at DESC LIMIT 5'
    )

    res.json({
      success: true,
      data: {
        total: totalResult[0]?.count || 0,
        todo: todoResult[0]?.count || 0,
        inProgress: inProgressResult[0]?.count || 0,
        done: doneResult[0]?.count || 0,
        highPriority: highPriorityResult[0]?.count || 0,
        recentTasks: recentTasks.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          createdAt: t.created_at
        }))
      }
    })
  } catch (err) {
    next(err)
  }
})

export default router
