'use client'

import dynamic from 'next/dynamic'
import { Widget, Profile, WidgetType } from '@/types'

const EditorController = dynamic(
  () => import('./EditorController').then((mod) => mod.EditorController),
  { ssr: false }
)

interface ClientEditorWrapperProps {
  initialWidgets: Widget[]
  profile: Profile
  onAdd: (type: WidgetType) => Promise<void> // Changed from 'any' to 'WidgetType'
}

export function ClientEditorWrapper({ initialWidgets, profile, onAdd }: ClientEditorWrapperProps) {
  return (
    <EditorController 
      initialWidgets={initialWidgets} 
      profile={profile} 
      onAdd={onAdd} 
    />
  )
}