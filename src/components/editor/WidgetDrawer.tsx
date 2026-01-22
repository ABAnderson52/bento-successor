'use client'

import React, { useState } from 'react'
import { Widget } from '@/types'
import { X, Save, Loader2 } from 'lucide-react'
import { updateWidgetContent } from '@/app/(auth)/actions'

interface WidgetDrawerProps {
  widget: Widget
  isOpen: boolean
  onClose: () => void
}

export function WidgetDrawer({ widget, isOpen, onClose }: WidgetDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState(widget.content)

  if (!isOpen) return null

const handleSave = async () => {
    setLoading(true)
    try {
      await updateWidgetContent(widget.id, content)
      onClose()
    } catch (err) {
      console.error("Update failed:", err)
      alert("Failed to update widget")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Widget</h2>
            <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mt-1">{widget.type}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6">
          {/* Common Field: Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-500 uppercase">Title</label>
            <input 
              type="text"
              value={content.title || ''}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
              placeholder="Widget Title"
            />
          </div>

          {/* Conditional Field: Description (for profile/text) */}
          {(widget.type === 'profile' || widget.type === 'text') && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-500 uppercase">Description</label>
              <textarea 
                value={content.description || ''}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-zinc-500 outline-none transition-all min-h-32 resize-none"
                placeholder="Write something..."
              />
            </div>
          )}

          {/* Conditional Field: Link (for link/social) */}
          {(widget.type === 'link' || widget.type === 'social') && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-500 uppercase">URL / Link</label>
              <input 
                type="url"
                value={content.url || ''}
                onChange={(e) => setContent({ ...content, url: e.target.value })}
                className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                placeholder="https://..."
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}