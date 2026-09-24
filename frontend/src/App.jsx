import React, { useState, useEffect } from 'react'
import { TaskProvider } from './context/TaskContext'
import Dashboard from './components/Dashboard'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import Header from './components/Header'
import { Toast } from './components/Toast'
import { useToast } from './hooks/useToast'

export default function App() {
  const { toast, showToast, hideToast } = useToast()

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard onShowToast={showToast} />
          <TaskList onShowToast={showToast} />
        </main>

        {/* Floating Add Button */}
        <TaskForm onShowToast={showToast} />

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} />
        )}
      </div>
    </TaskProvider>
  )
}
