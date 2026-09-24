import React, { useState } from 'react'
import { useTasks } from '../context/TaskContext'
import { Edit2, Trash2, Calendar, AlertCircle, CheckCircle } from 'lucide-react'

const statusConfig = {
  'todo': {
    label: 'To Do',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200'
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200'
  },
  'done': {
    label: 'Done',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200'
  }
}

const priorityConfig = {
  'low': { label: 'Low', color: 'text-slate-500' },
  'medium': { label: 'Medium', color: 'text-amber-600' },
  'high': { label: 'High', color: 'text-red-600' }
}

export default function TaskCard({ task, onShowToast }) {
  const { updateTask, deleteTask } = useTasks()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const status = statusConfig[task.status] || statusConfig['todo']
  const priority = priorityConfig[task.priority] || priorityConfig['medium']

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTask(task.id, { ...task, status: newStatus })
      onShowToast(`Task moved to ${statusConfig[newStatus].label}`, 'success')
    } catch (err) {
      onShowToast('Failed to update status', 'error')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return
    setIsDeleting(true)
    try {
      await deleteTask(task.id)
      onShowToast('Task deleted', 'success')
    } catch (err) {
      onShowToast('Failed to delete task', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const nextStatus = task.status === 'todo' ? 'in-progress' :
                     task.status === 'in-progress' ? 'done' : null

  return (
    <div className={`card p-5 border-l-4 ${status.border} hover:shadow-lg transition-all duration-200`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <h3 className="font-semibold text-slate-900 truncate">{task.title}</h3>
            {task.priority === 'high' && (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
            )}
          </div>

          {task.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Badge */}
            <span className={`badge ${status.bg} ${status.text}`}>
              {status.label}
            </span>

            {/* Priority */}
            <span className={`text-xs font-medium ${priority.color}`}>
              {priority.label} Priority
            </span>

            {/* Date */}
            {task.createdAt && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3 h-3" />
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          {nextStatus && (
            <button
              onClick={() => handleStatusChange(nextStatus)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
                       bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100
                       transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {task.status === 'todo' ? 'Start' : 'Complete'}
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50
                       rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50
                       rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditModal
          task={task}
          onClose={() => setIsEditing(false)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  )
}

function EditModal({ task, onClose, onShowToast }) {
  const { updateTask } = useTasks()
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority || 'medium'
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await updateTask(task.id, formData)
      onShowToast('Task updated!', 'success')
      onClose()
    } catch (err) {
      onShowToast('Failed to update task', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in"
           onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Edit Task</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input min-h-[80px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="input"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
