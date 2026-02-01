'use client'

import React, { useEffect } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Widget, Profile } from '@/types'
import { X, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { ProfileTile } from '@/components/widgets/ProfileTile'
import { SocialTile } from '@/components/widgets/SocialTile'
import { ImageTile } from '@/components/widgets/ImageTile'
import { LinkTile } from '@/components/widgets/LinkTile'
import { TextTile } from '@/components/widgets/TextTile'

interface SortableWidgetProps {
  widget: Widget
  profile: Profile
  onDelete: () => void
  isEditing: boolean
  isSelected?: boolean
  onSelect?: () => void
  isDragging?: boolean 
}

export function SortableWidget({ 
  widget, 
  profile,
  onDelete, 
  isEditing, 
  isSelected, 
  onSelect,
  isDragging: isExternalDragging 
}: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isInternalDragging 
  } = useSortable({ 
    id: widget.id,
    disabled: !isEditing
  })

  const dragging = isInternalDragging || isExternalDragging

  useEffect(() => {
    if (isSelected) {
      const timer = setTimeout(() => {
        document.getElementById(`widget-${widget.id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [isSelected, widget.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: dragging ? 1000 : isSelected ? 999 : 1,
    opacity: dragging ? 0.4 : 1,
  };

  const gridClasses = `
    ${widget.w === 2 ? 'col-span-2' : 'col-span-1'}
    ${widget.h === 2 ? 'row-span-2' : 'row-span-1'}
  `.trim();

  const confirmDelete = () => {
    toast.error("Delete this widget?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
          onDelete();
          toast.success("Widget deleted");
        },
      },
      cancel: { 
        label: "Cancel",
        onClick: () => {} 
      },
    });
  };

  const TileMap: Record<string, React.ReactNode> = {
    profile: <ProfileTile profile={profile} />,
    social: <SocialTile widget={widget} />,
    image: <ImageTile widget={widget} />,
    link: <LinkTile widget={widget} />,
    text: <TextTile widget={widget} />,
  };

  return (
    <div
      id={`widget-${widget.id}`}
      ref={setNodeRef}
      style={style}
      {...(isEditing ? { ...attributes, ...listeners } : {})}
      className={`
        group relative aspect-square md:aspect-auto p-6 rounded-4xl transition-all duration-500
        bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100
        ${gridClasses}
        ${isSelected 
          ? 'scale-[1.02] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] ring-1 ring-zinc-900/10 dark:ring-white/20 z-50' 
          : isEditing 
            ? 'border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-grab active:cursor-grabbing' 
            : 'border-zinc-100/50 dark:border-zinc-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-default'
        }
      `}
    >
      {/* 1. INTERACTION LAYER (View Mode) */}
      {!isEditing && widget.content?.url && widget.type !== 'profile' && (
        <a 
          href={widget.content.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute inset-0 z-30 rounded-4xl"
        />
      )}

      {/* 2. EDITING OVERLAY */}
      {isEditing && (
        <div className={`absolute top-4 right-4 flex gap-2 z-50 transition-opacity ${dragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-transform"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); confirmDelete(); }}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 3. CONTENT */}
      <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none select-none">
        {TileMap[widget.type] || null}
      </div>
    </div>
  )
}