import { useState, useEffect } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  const hideToast = () => setToast(null)

  return { toast, showToast, hideToast }
}
