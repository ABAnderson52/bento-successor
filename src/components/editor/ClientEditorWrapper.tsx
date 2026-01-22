'use client'

import dynamic from 'next/dynamic'
import { Widget } from '@/types'

const EditorController = dynamic(
  () => import('./EditorController').then((mod) => mod.EditorController),
  { ssr: false }
)

interface ClientEditorWrapperProps {
  initialWidgets: Widget[]
  onAdd: (type: any) => Promise<void>
}

export function ClientEditorWrapper({ initialWidgets, onAdd }: ClientEditorWrapperProps) {
  return <EditorController initialWidgets={initialWidgets} onAdd={onAdd} />
}