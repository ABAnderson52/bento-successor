'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Widget, WidgetContent, SocialPlatform } from '@/types'
import { X, Save, Loader2, Upload } from 'lucide-react'
import { updateWidgetContent, uploadWidgetImage, deleteStorageFile } from '@/app/(auth)/actions'
import { SOCIAL_PLATFORMS } from '@/lib/constants'

interface WidgetDrawerProps {
  widget: Widget
  isOpen: boolean
  onClose: () => void
}

export function WidgetDrawer({ widget, isOpen, onClose }: WidgetDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [content, setContent] = useState<WidgetContent>(widget.content)
  const [dimensions, setDimensions] = useState({ w: widget.w, h: widget.h })
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      if (content.imageUrl) await deleteStorageFile(content.imageUrl)
      const publicUrl = await uploadWidgetImage(formData)
      setContent({ ...content, imageUrl: publicUrl, objectPosition: 'center' })
    } catch (err) {
      alert("Upload failed. Max 5MB.")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateWidgetContent(widget.id, content, dimensions)
      onClose()
    } catch (err) {
      alert("Failed to update widget")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Edit Widget</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto pr-2">
          
          {/* 1. SHAPE SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Tile Shape</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Square', w: 1, h: 1 },
                { label: 'Wide', w: 2, h: 1 },
                { label: 'Tall', w: 1, h: 2 },
              ].map((shape) => (
                <button
                  key={shape.label}
                  onClick={() => setDimensions({ w: shape.w, h: shape.h })}
                  className={`p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                    dimensions.w === shape.w && dimensions.h === shape.h
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  {shape.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. PLATFORM SELECTOR (Only for Social type) */}
          {widget.type === 'social' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setContent({ 
                        ...content, 
                        platform: key as SocialPlatform,
                        title: content.title || platform.name 
                      })}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        content.platform === key 
                          ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' 
                          : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-200'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-xs font-bold">{platform.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* 3. IMAGE FOCUS (Only for Image type) */}
          {widget.type === 'image' && content.imageUrl && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Image Focus</label>
              <div className="flex gap-2">
                {['top', 'center', 'bottom'].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setContent({ ...content, objectPosition: pos })}
                    className={`flex-1 py-2 rounded-lg border capitalize text-sm ${
                      content.objectPosition === pos 
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-400' 
                        : 'border-transparent bg-zinc-50 dark:bg-zinc-900'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload Section */}
          {widget.type === 'image' && (
             <div className="space-y-2">
               <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Widget Image</label>
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="relative group aspect-video rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden bg-zinc-50 dark:bg-zinc-900/50"
               >
                 {content.imageUrl ? (
                   <Image 
                     src={content.imageUrl} 
                     alt="Preview" 
                     fill 
                     className={`object-cover object-${content.objectPosition || 'center'}`} 
                   />
                 ) : (
                   <div className="flex flex-col items-center text-zinc-400">
                     {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                     <p className="text-xs mt-2 font-medium">Upload Image</p>
                   </div>
                 )}
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleFileChange} 
               />
             </div>
          )}

          {/* Common Fields: Title and URL */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Title</label>
              <input 
                type="text"
                placeholder="Title"
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
              />
            </div>

            {(widget.type === 'link' || widget.type === 'social') && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">URL</label>
                <input 
                  type="text"
                  placeholder="https://..."
                  value={content.url || ''}
                  onChange={(e) => setContent({ ...content, url: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none focus:ring-2 focus:ring-zinc-500 outline-none transition-all"
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="w-full mt-6 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}