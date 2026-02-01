'use client'

import React, { useState, useEffect} from 'react'
import {
  DndContext, 
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Widget, Profile } from '@/types'
import { SortableWidget } from './SortableWidget'
import { deleteWidget, updateWidgetOrder, deleteStorageFile } from '@/app/(auth)/actions'

interface GridCanvasProps {
  initialWidgets: Widget[]
  profile: Profile
  isEditing: boolean
  selectedWidgetId: string | null
  onWidgetSelect: (id: string | null) => void
}

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: '0.5' } },
  }),
};

export function GridCanvas({ 
  initialWidgets, 
  profile,
  isEditing, 
  selectedWidgetId, 
  onWidgetSelect 
}: GridCanvasProps) {
  const [widgets, setWidgets] = useState(initialWidgets)
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null)

  useEffect(() => {
    setWidgets(initialWidgets)
  }, [initialWidgets])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    if (!isEditing) return
    const { active } = event
    setActiveWidget(widgets.find((w) => w.id === active.id) || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveWidget(null)

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((i) => i.id === active.id)
      const newIndex = widgets.findIndex((i) => i.id === over.id)
      
      const newOrder = arrayMove(widgets, oldIndex, newIndex)
      setWidgets(newOrder)

      const updatedOrderPayload = newOrder.map((widget, index) => ({
        id: widget.id,
        created_at: new Date(Date.now() + index * 1000).toISOString()
      }))

      try {
        await updateWidgetOrder(updatedOrderPayload)
      } catch (err) {
        console.error("Order sync failed:", err)
        setWidgets(initialWidgets)
      }
    }
  }

  const handleDelete = async (id: string) => {
    const widgetToDelete = widgets.find(w => w.id === id)
    if (!widgetToDelete) return

    setWidgets((prev) => prev.filter(w => w.id !== id))

    try {
      if (widgetToDelete.content?.imageUrl) {
        await deleteStorageFile(widgetToDelete.content.imageUrl)
      }
      await deleteWidget(id)
    } catch (error) {
      console.error("Delete operation failed:", error);
      setWidgets(initialWidgets)
      alert("Failed to delete widget")
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={rectIntersection}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative z-0 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-7xl mx-auto auto-rows-[minmax(140px,auto)] pb-20">
        <SortableContext 
          items={widgets.map(w => w.id)} 
          strategy={rectSortingStrategy}
        >
          {widgets.map((widget) => (
            <SortableWidget 
              key={widget.id} 
              widget={widget} 
              profile={profile}
              onDelete={() => handleDelete(widget.id)}
              isEditing={isEditing}
              isSelected={selectedWidgetId === widget.id}
              onSelect={() => onWidgetSelect(widget.id)}
              isDragging={activeWidget?.id === widget.id}
            />
          ))}
        </SortableContext>
      </div>

      <DragOverlay dropAnimation={dropAnimationConfig} zIndex={1000}>
        {activeWidget ? (
          <div className="cursor-grabbing rotate-3 scale-105 transition-transform duration-200 touch-none shadow-2xl rounded-3xl overflow-hidden ring-4 ring-zinc-500/20">
            <SortableWidget 
              widget={activeWidget}
              profile={profile}
              onDelete={() => {}} 
              isEditing={false}
              isSelected={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}