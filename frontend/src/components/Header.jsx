import React from 'react'
import { Container, Layers } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700
                          flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Container className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                TaskFlow
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Dockerized Task Manager
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">
              Powered by Docker
            </span>
          </div>

          {/* Docker Icon */}
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <Layers className="w-5 h-5" />
            <span className="text-xs font-mono">v3</span>
          </div>
        </div>
      </div>
    </header>
  )
}
