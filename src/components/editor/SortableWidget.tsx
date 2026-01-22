'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Widget } from '@/types'
import { X, Pencil } from 'lucide-react'
import { WidgetDrawer } from './WidgetDrawer'

interface SortableWidgetProps {
  widget: Widget
  onDelete: () => void
}

export function SortableWidget({ widget, onDelete }: SortableWidgetProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: widget.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`
          group relative aspect-square md:aspect-auto p-6 rounded-4xl 
          bg-white dark:bg-zinc-900 
          border border-zinc-200 dark:border-zinc-800
          shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing
          ${widget.w === 2 ? 'md:col-span-2' : 'md:col-span-1'}
          ${widget.h === 2 ? 'md:row-span-2 min-h-80' : 'md:row-span-1 min-h-37.5'}
        `}
      >
        {/* Wrapper for image to allow clipping while parent remains overflow-visible */}
        {widget.type === 'image' && widget.content?.imageUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden rounded-4xl">
            <Image 
              src={widget.content.imageUrl} 
              alt={widget.content.title || "Widget image"}
              fill
              className={`object-cover object-${widget.content.objectPosition || 'center'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-black/30 transition-colors" />
          </div>
        )}

        {/* Action Buttons Container - Restored to -top-2 -right-2 */}
        <div className="absolute -top-2 -right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDrawerOpen(true);
            }}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg hover:scale-110 transition-transform cursor-pointer"
            title="Edit widget"
          >
            <Pencil size={14} strokeWidth={2.5} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors cursor-pointer"
            title="Delete widget"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>

        <div className="relative z-10 flex flex-col h-full pointer-events-none select-none">
          <span className={`text-[10px] uppercase tracking-widest font-bold ${widget.type === 'image' && widget.content?.imageUrl ? 'text-white/80' : 'text-zinc-400'}`}>
            {widget.type}
          </span>
          <div className={`mt-2 font-medium text-lg ${widget.type === 'image' && widget.content?.imageUrl ? 'text-white shadow-sm' : 'text-zinc-900 dark:text-zinc-100'}`}>
            {widget.content?.title || "New Widget"}
          </div>
        </div>
      </div>

      <WidgetDrawer 
        widget={widget} 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  )
}