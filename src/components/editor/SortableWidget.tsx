'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Widget } from '@/types'
import { X, Pencil, Globe, User } from 'lucide-react'
import { SOCIAL_PLATFORMS } from '@/lib/constants'

interface SortableWidgetProps {
  widget: Widget
  onDelete: () => void
  isEditing: boolean
  isSelected?: boolean
  onSelect?: () => void
}

export function SortableWidget({ widget, onDelete, isEditing, isSelected, onSelect }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: widget.id,
    disabled: !isEditing
  })

  useEffect(() => {
    if (isSelected) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`widget-${widget.id}`);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [isSelected, widget.id]);

  const platform = widget.type === 'social' && widget.content?.platform
    ? SOCIAL_PLATFORMS[widget.content.platform as keyof typeof SOCIAL_PLATFORMS]
    : null

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
  zIndex: isDragging ? 1000 : isSelected ? 999 : 1,
  position: (isDragging || isSelected) ? 'relative' as const : undefined,
  opacity: isDragging ? 0.5 : 1,
};

  const containerClasses = 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'

  const displayUrl = widget.content?.url 
    ? widget.content.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : 'Website'

  return (
    <div
      id={`widget-${widget.id}`}
      ref={setNodeRef}
      style={style}
      {...(isEditing ? { ...attributes, ...listeners } : {})}
      className={`
        group relative aspect-square md:aspect-auto p-6 rounded-4xl transition-all duration-500
        ${containerClasses}
        ${isSelected 
          ? 'ring-4 ring-white dark:ring-zinc-800 scale-[1.05] shadow-2xl z-50' 
          : isEditing 
            ? 'border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing' 
            : 'border-zinc-100/50 dark:border-zinc-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-default'
        }
        ${widget.w === 2 ? 'md:col-span-2' : 'md:col-span-1'}
        ${widget.h === 2 ? 'md:row-span-2 min-h-80' : 'md:row-span-1 min-h-37.5'}
      `}
    >
      {!isEditing && widget.content?.url && (
        <a 
          href={widget.content.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute inset-0 z-30 rounded-4xl"
        />
      )}

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

      {isEditing && (
        <div className={`absolute -top-2 -right-2 flex gap-2 transition-opacity z-50 ${isSelected ? 'opacity-0' : 'group-hover:opacity-100'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(); 
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
      )}

      <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none select-none">
        {widget.type === 'profile' ? (
          <div className="flex flex-col md:flex-row items-center gap-6 h-full w-full">
            <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-full border-2 border-white dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-800">
              {widget.content?.imageUrl ? (
                <Image 
                  src={widget.content.imageUrl} 
                  alt="Avatar" 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400">
                  <User size={32} />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center text-center md:text-left overflow-hidden">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
                {widget.content?.title || "Your Name"}
              </h2>
              <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-3 leading-relaxed">
                {widget.content?.description || "Write a short bio about yourself..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              {platform ? (
                <div className={`h-12 w-12 flex items-center justify-center rounded-2xl shadow-sm ${platform.color} text-white`}>
                  <platform.icon size={24} />
                </div>
              ) : widget.type === 'link' ? (
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl shadow-sm bg-white dark:bg-zinc-100 text-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden relative">
                  {widget.content?.iconUrl ? (
                    <Image 
                      src={widget.content.iconUrl as string} 
                      alt="" 
                      fill
                      className="object-contain p-2.5"
                      unoptimized 
                    />
                  ) : (
                    <Globe size={24} strokeWidth={2} className="text-zinc-400" />
                  )}
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
                <p className="text-xs font-medium text-zinc-400 mt-1 truncate max-w-[90%]">
                  {displayUrl}
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}