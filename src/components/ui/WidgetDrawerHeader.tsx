import React from 'react'
import { X } from 'lucide-react'

interface WidgetDrawerHeaderProps {
  title: string
  onClose: () => void
}

export function WidgetDrawerHeader({ title, onClose }: WidgetDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <p className="text-xs text-zinc-500 font-medium">Real-time customization</p>
      </div>
      <button 
        onClick={onClose} 
        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  )
}