'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Widget } from '@/types'

export function SortableWidget({ widget }: { widget: Widget }) {
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative aspect-square md:aspect-auto p-6 rounded-[2rem] 
        bg-white dark:bg-zinc-900 
        border border-zinc-200 dark:border-zinc-800
        shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing
        ${widget.w === 2 ? 'md:col-span-2' : ''}
        ${widget.h === 2 ? 'md:row-span-2 min-h-[320px]' : 'min-h-[150px]'}
      `}
    >
      <div className="flex flex-col h-full">
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
          {widget.type}
        </span >
        <div className="mt-2 font-medium">
          {widget.content?.title || "New Widget"}
        </div>
      </div>
    </div>
  )
}