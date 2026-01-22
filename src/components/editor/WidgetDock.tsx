'use client'

import React from 'react'
import { Plus, User, Share2, Link2, Image as ImageIcon, Type } from 'lucide-react'
import { WidgetType } from '@/types'

interface WidgetDockProps {
  onAdd: (type: WidgetType) => void
}

export function WidgetDock({ onAdd }: WidgetDockProps) {
  const widgetOptions: { type: WidgetType; icon: any; label: string }[] = [
    { type: 'profile', icon: User, label: 'Profile' },
    { type: 'social', icon: Share2, label: 'Social' },
    { type: 'link', icon: Link2, label: 'Link' },
    { type: 'image', icon: ImageIcon, label: 'Image' },
    { type: 'text', icon: Type, label: 'Text' },
  ]

  return (
    <div className="fixed inset-x-0 bottom-10 z-[9999] flex justify-center pointer-events-none">
      <div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl pointer-events-auto backdrop-blur-xl">
        {widgetOptions.map((opt) => (
          <button
            key={opt.type}
            onClick={(e) => {
              e.preventDefault();
              onAdd(opt.type);
            }}
            className="group relative flex items-center justify-center h-12 w-12 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
          >
            {/* The Icon - Forced color and stroke */}
            <opt.icon 
              size={20} 
              className="text-zinc-900 dark:text-zinc-100 block" 
              strokeWidth={2}
            />
            
            {/* Tooltip - Only shows on hover */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-xl">
              {opt.label}
            </span>
          </button>
        ))}
        
        <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />
        
        <button className="h-12 w-12 flex items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black">
          <Plus size={20} />
        </button>
      </div>
    </div>
  )
}