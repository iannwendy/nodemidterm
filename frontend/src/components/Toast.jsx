import React from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    iconColor: 'text-emerald-500'
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    iconColor: 'text-red-500'
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500'
  }
}

export function Toast({ message, type = 'info', onClose }) {
  const config = toastConfig[type] || toastConfig.info
  const Icon = config.icon

  return (
    <div className={`fixed bottom-20 right-4 z-50 animate-slide-up`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg
                      border ${config.bg} ${config.border} ${config.text}`}>
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
        <p className="font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-white/50 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
