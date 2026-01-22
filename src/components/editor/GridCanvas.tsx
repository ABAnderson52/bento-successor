'use client'

import React, { useState, useEffect } from 'react'
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Widget } from '@/types'
import { SortableWidget } from './SortableWidget'
import { deleteWidget, updateWidgetOrder } from '@/app/(auth)/actions'

interface GridCanvasProps {
  initialWidgets: Widget[]
}

export function GridCanvas({ initialWidgets }: GridCanvasProps) {
  const [widgets, setWidgets] = useState(initialWidgets)

  useEffect(() => {
    setWidgets(initialWidgets)
  }, [initialWidgets])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((i) => i.id === active.id)
      const newIndex = widgets.findIndex((i) => i.id === over.id)
      
      const newOrder = arrayMove(widgets, oldIndex, newIndex)

      setWidgets(newOrder)

      const now = new Date()
      const updatedWidgets = newOrder.map((widget, index) => ({
        id: widget.id,
        created_at: new Date(now.getTime() + index * 1000).toISOString()
      }))

try {
      await updateWidgetOrder(updatedWidgets)
    } catch (err) {
      console.error("Order update failed:", err)
      setWidgets(initialWidgets)
    }}
  }

const handleDelete = async (id: string) => {
    try {
      setWidgets((current) => current.filter(w => w.id !== id))
      await deleteWidget(id)
    } catch (err) { // Changed 'error' to 'err' and utilized it below
      console.error("Delete failed:", err)
      setWidgets(initialWidgets)
      alert("Failed to delete widget")
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
        <SortableContext 
          items={widgets.map(w => w.id)} 
          strategy={rectSortingStrategy}
        >
          {widgets.map((widget) => (
            <SortableWidget 
              key={widget.id} 
              widget={widget} 
              onDelete={() => handleDelete(widget.id)}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )
}