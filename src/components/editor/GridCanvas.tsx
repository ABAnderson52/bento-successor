'use client'

import React, { useState } from 'react'
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

interface GridCanvasProps {
  initialWidgets: Widget[]
}

export function GridCanvas({ initialWidgets }: GridCanvasProps) {
  const [widgets, setWidgets] = useState(initialWidgets)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Stops accidental drags when clicking buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        
        const newOrder = arrayMove(items, oldIndex, newIndex)
        
        // TODO: Save this new order to Supabase!
        return newOrder
      })
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
            <SortableWidget key={widget.id} widget={widget} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )
}