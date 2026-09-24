import React, { useState } from 'react'
import { Plus, Search, Filter, LayoutList } from 'lucide-react'
import TaskCard from './TaskCard'
import { useTasks } from '../context/TaskContext'

export default function TaskList({ onShowToast }) {
  const { tasks, loading, refreshTasks } = useTasks()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tasks</h2>
          <p className="text-sm text-slate-500 mt-1">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all
                         ${filterStatus === option.value
                           ? 'bg-white text-slate-900 shadow-sm'
                           : 'text-slate-600 hover:text-slate-900'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-5 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded-full w-20" />
              </div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card p-12 text-center">
          <LayoutList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No tasks found' : 'No tasks yet'}
          </h3>
          <p className="text-slate-500 mb-4">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first task'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create First Task
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id || index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard task={task} onShowToast={onShowToast} />
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showForm && (
        <TaskFormModal
          onClose={() => setShowForm(false)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  )
}

function TaskFormModal({ onClose, onShowToast }) {
  const { addTask } = useTasks()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium'
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addTask(formData)
      onShowToast('Task created successfully!', 'success')
      onClose()
    } catch (err) {
      onShowToast('Failed to create task', 'error')
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
          <h3 className="text-lg font-bold text-slate-900">Create New Task</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input min-h-[100px] resize-none"
              placeholder="Describe your task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Status
              </label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Priority
              </label>
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
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
