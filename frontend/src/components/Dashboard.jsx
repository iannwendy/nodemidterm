import React from 'react'
import { useTasks } from '../context/TaskContext'
import { CheckCircle2, Clock, ListTodo, BarChart3 } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, bgColor }) {
  return (
    <div className="card p-6 group hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard({ onShowToast }) {
  const { stats, loading } = useTasks()

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-slate-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  const completionRate = stats.total > 0
    ? Math.round((stats.done / stats.total) * 100)
    : 0

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 mt-1">
            Track your team's progress in real-time
          </p>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="3"
                strokeDasharray={`${completionRate}, 100`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-700">{completionRate}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Completed</p>
            <p className="text-xs text-slate-500">of total tasks</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ListTodo}
          label="Total Tasks"
          value={stats.total}
          color="text-primary-600"
          bgColor="bg-primary-50"
        />
        <StatCard
          icon={Clock}
          label="To Do"
          value={stats.todo}
          color="text-slate-600"
          bgColor="bg-slate-100"
        />
        <StatCard
          icon={BarChart3}
          label="In Progress"
          value={stats.inProgress}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatCard
          icon={CheckCircle2}
          label="Done"
          value={stats.done}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
      </div>
    </div>
  )
}
