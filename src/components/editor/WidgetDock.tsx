'use client'

import React from 'react'
import { Plus, User, Share2, Link2, Image as ImageIcon, Type, LucideIcon } from 'lucide-react'
import { WidgetType, Widget } from '@/types'

interface WidgetDockProps {
  widgets: Widget[]
  onAdd: (type: WidgetType) => void
}

export function WidgetDock({ widgets, onAdd }: WidgetDockProps) {
  const hasProfile = widgets.some(w => w.type === 'profile')

  const widgetOptions: { type: WidgetType; icon: LucideIcon; label: string; disabled?: boolean }[] = [
    { 
      type: 'profile', 
      icon: User, 
      label: hasProfile ? 'Profile (Added)' : 'Profile',
      disabled: hasProfile 
    },
    { type: 'social', icon: Share2, label: 'Social' },
    { type: 'link', icon: Link2, label: 'Link' },
    { type: 'image', icon: ImageIcon, label: 'Image' },
    { type: 'text', icon: Type, label: 'Text' },
  ]

  return (
    <div className="fixed inset-x-0 bottom-10 z-9999 flex justify-center pointer-events-none">
      <div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl pointer-events-auto backdrop-blur-xl">
        {widgetOptions.map((opt) => (
          <button
            key={opt.type}
            disabled={opt.disabled}
            onClick={(e) => {
              e.preventDefault();
              onAdd(opt.type);
            }}
            className={`
              group relative flex items-center justify-center h-12 w-12 rounded-2xl transition-all 
              ${opt.disabled 
                ? 'opacity-20 cursor-not-allowed' 
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95'
              }
            `}
          >
            <opt.icon 
              size={20} 
              className="text-zinc-900 dark:text-zinc-100 block" 
              strokeWidth={2}
            />
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-xl">
              {opt.label}
            </span>
          </button>
        ))}
        
        <div className="w-px h-6 bg-zinc-200 dark:border-zinc-800 mx-1" />
        
        <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black">
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}