import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useTasks } from '../context/TaskContext'

export default function TaskForm({ onShowToast }) {
  const { addTask } = useTasks()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium'
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setSubmitting(true)
    try {
      await addTask(formData)
      onShowToast('Task created successfully!', 'success')
      setFormData({ title: '', description: '', status: 'todo', priority: 'medium' })
      setIsOpen(false)
    } catch (err) {
      onShowToast('Failed to create task', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 text-white
                 shadow-lg shadow-primary-500/30 flex items-center justify-center
                 hover:bg-primary-700 hover:scale-105 active:scale-95
                 transition-all duration-200 z-30"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Slide-up Form */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Form Panel */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl
                     transition-transform duration-300 ease-out ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="p-6">
            {/* Handle */}
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">New Task</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 text-lg border-2 border-slate-200 rounded-xl
                           focus:border-primary-500 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Add details (optional)"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl
                           focus:border-primary-500 focus:outline-none transition-colors
                           resize-none min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl
                             focus:border-primary-500 focus:outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl
                             focus:border-primary-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.title.trim()}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl
                         hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
              >
                {submitting ? 'Creating...' : 'Create Task'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
