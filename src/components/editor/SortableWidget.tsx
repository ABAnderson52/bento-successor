'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Widget } from '@/types'
import { X, Pencil, Globe } from 'lucide-react' // Added Globe
import { WidgetDrawer } from './WidgetDrawer'
import { SOCIAL_PLATFORMS } from '@/lib/constants'

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

  const platform = widget.type === 'social' && widget.content?.platform
    ? SOCIAL_PLATFORMS[widget.content.platform as keyof typeof SOCIAL_PLATFORMS]
    : null

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  }

  const containerClasses = 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`
          group relative aspect-square md:aspect-auto p-6 rounded-4xl 
          border border-zinc-200 dark:border-zinc-800
          shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing
          ${containerClasses}
          ${widget.w === 2 ? 'md:col-span-2' : 'md:col-span-1'}
          ${widget.h === 2 ? 'md:row-span-2 min-h-80' : 'md:row-span-1 min-h-37.5'}
        `}
      >
        {/* Background Image handling */}
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

        {/* Action Buttons */}
        <div className="absolute -top-2 -right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDrawerOpen(true);
            }}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xl border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-transform cursor-pointer"
          >
            <Pencil size={12} strokeWidth={2.5} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-7 w-7 flex items-center justify-center rounded-full bg-red-500 text-white shadow-xl hover:bg-red-600 transition-colors cursor-pointer"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none select-none">
          <div className="flex justify-between items-start">
            {/* Show icon for social platforms OR globe for generic links */}
            {platform ? (
              <div className={`h-12 w-12 flex items-center justify-center rounded-2xl shadow-sm ${platform.color} text-white`}>
                <platform.icon size={24} />
              </div>
            ) : widget.type === 'link' ? (
              <div className="h-12 w-12 flex items-center justify-center rounded-2xl shadow-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900">
                <Globe size={24} strokeWidth={2} />
              </div>
            ) : null}
          </div>

          <div className="mt-auto">
            <h3 className={`font-bold text-xl leading-tight tracking-tight ${widget.type === 'image' && widget.content?.imageUrl ? 'text-white drop-shadow-md' : ''}`}>
              {widget.content?.title || "New Widget"}
            </h3>
            {platform ? (
              <p className="text-sm font-medium text-zinc-400 mt-1">
                {platform.name}
              </p>
            ) : widget.type === 'link' ? (
              <p className="text-sm font-medium text-zinc-400 mt-1">
                Website
              </p>
            ) : null}
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