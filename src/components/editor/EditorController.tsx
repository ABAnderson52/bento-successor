'use client'

import React, { useState, useMemo } from 'react'
import { GridCanvas } from './GridCanvas'
import { WidgetDock } from './WidgetDock'
import { WidgetDrawer } from './WidgetDrawer'
import { SortableWidget } from './SortableWidget'
import { Widget, WidgetType } from '@/types'
import { Eye, Edit3 } from 'lucide-react'

interface EditorControllerProps {
  initialWidgets: Widget[]
  onAdd: (type: WidgetType) => Promise<void>
}

export function EditorController({ initialWidgets, onAdd }: EditorControllerProps) {
  const [isEditing, setIsEditing] = useState(true)
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)

  const activeWidget = useMemo(() => 
    initialWidgets.find((w: Widget) => w.id === selectedWidgetId),
    [initialWidgets, selectedWidgetId]
  )

  const handleModeChange = (editing: boolean) => {
    setIsEditing(editing)
    if (!editing) setSelectedWidgetId(null)
  }

  const activeSpotlightId = isEditing ? selectedWidgetId : null

  return (
    <div className="relative">
      {/* 1. THE CONTENT LAYER */}
      <div className={`transition-all duration-700 ${
        activeSpotlightId ? 'blur-md grayscale-[0.5] opacity-40 scale-[0.98] pointer-events-none' : ''
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 px-6 lg:px-12 pt-8">
  <div className="space-y-1">
    <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
      Canvas
    </h1>
    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
      Arrange and customize your personal space
    </p>
  </div>

  <div className="flex p-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl">
    <button 
      onClick={() => handleModeChange(true)} 
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
        isEditing ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg' : 'text-zinc-400'
      }`}
    >
      <Edit3 size={14} /> Build
    </button>
    <button 
      onClick={() => handleModeChange(false)} 
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
        !isEditing ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg' : 'text-zinc-400'
      }`}
    >
      <Eye size={14} /> Design
    </button>
  </div>
</div>

        <div className="px-6 lg:px-12 pb-40">
          <GridCanvas 
            initialWidgets={initialWidgets} 
            isEditing={isEditing} 
            selectedWidgetId={activeSpotlightId}
            onWidgetSelect={setSelectedWidgetId}
          />
        </div>
      </div>

      {/* 2. THE SPOTLIGHT LAYER (High Z-Index to clear the Nav) */}
      {activeSpotlightId && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center md:justify-start">
          <div 
            onClick={() => setSelectedWidgetId(null)}
            className="absolute inset-0 bg-zinc-950/20 dark:bg-black/60 animate-in fade-in duration-500 cursor-pointer" 
          />
          
          <div className="relative z-10 md:pl-20 lg:pl-40 pointer-events-none">
            {activeWidget && (
              <div className="pointer-events-auto w-[320px] md:w-105 animate-in fade-in zoom-in-95 slide-in-from-left-10 duration-500">
                <SortableWidget 
                  widget={activeWidget}
                  onDelete={() => {}} 
                  isEditing={false}
                  isSelected={true}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. THE DRAWER (Highest Z-Index) */}
      {activeWidget && (
        <WidgetDrawer 
          widget={activeWidget}
          isOpen={!!activeSpotlightId}
          onClose={() => setSelectedWidgetId(null)}
        />
      )}

      {/* 4. THE DOCK (Hidden/Slid down when editing) */}
      {isEditing && (
        <div className={`fixed bottom-8 left-0 right-0 z-100 pointer-events-none flex justify-center transition-all duration-500 ${
          activeSpotlightId ? 'translate-y-32 opacity-0' : 'translate-y-0 opacity-100'
        }`}>
            <div className="pointer-events-auto">
                <WidgetDock onAdd={onAdd} />
            </div>
        </div>
      )}
    </div>
  )
}