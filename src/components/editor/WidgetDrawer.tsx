'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Widget, WidgetContent, SocialPlatform } from '@/types'
import { X, Save, Loader2, Upload, User, Layout } from 'lucide-react'
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
      const finalContent = { ...content }

      if (widget.type === 'link' && content.url) {
        try {
          const domain = new URL(content.url).hostname
          finalContent.iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        } catch (urlErr) {
          console.error("Invalid URL for favicon scraping", urlErr)
        }
      }

      await updateWidgetContent(widget.id, finalContent, dimensions)
      onClose()
    } catch (err) {
      console.error(err)
      alert("Failed to update widget")
    } finally {
      setLoading(false)
    }
  }

  return (
    /* THE FIX: 
      1. z-[1100] to leapfrog the Top Nav and the Spotlight Layer (z-1000).
      2. pointer-events-none so clicking the "empty" space hits the Spotlight exit logic.
    */
    <div className="fixed inset-0 z-1100 flex justify-end pointer-events-none">
      
      {/* Transparent hit area removed its own onClick because the 
         EditorController Spotlight layer now handles the "click outside to close" 
         via the pointer-events-none on this parent.
      */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Side Panel: 
         1. pointer-events-auto RE-ENABLES interaction for the form.
         2. relative positioning ensures it stays in the stacking order.
      */}
      <div className="relative w-full max-w-md h-screen bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-500 ease-out pointer-events-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Edit {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}</h2>
            <p className="text-xs text-zinc-500 font-medium">Real-time customization</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
          
          {/* 1. LAYOUT SECTION */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <Layout size={14} />
              <label className="text-xs font-bold uppercase tracking-widest">Tile Configuration</label>
            </div>
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
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
                      : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 text-zinc-500'
                  }`}
                >
                  {shape.label}
                </button>
              ))}
            </div>
          </section>

          {/* 2. IDENTITY SECTION */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <User size={14} />
              <label className="text-xs font-bold uppercase tracking-widest">Identity</label>
            </div>
            
            {widget.type === 'social' && (
              <div className="grid grid-cols-2 gap-2 mb-4">
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
                          ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md' 
                          : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 text-zinc-500'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-[10px] font-black uppercase tracking-tight">{platform.name}</span>
                    </button>
                  )
                })}
              </div>
            )}

            <input 
              type="text"
              placeholder={widget.type === 'profile' ? "Your Name" : "Title"}
              value={content.title || ''}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
              className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none transition-all font-medium"
            />
          </section>

          {/* 3. CONTENT SECTION */}
          {(widget.type === 'link' || widget.type === 'social' || widget.type === 'profile') && (
            <section className="space-y-4">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                {widget.type === 'profile' ? 'Biography' : 'Destination'}
              </label>
              
              {widget.type === 'profile' ? (
                <textarea 
                  placeholder="Tell the world who you are..."
                  value={content.description || ''}
                  onChange={(e) => setContent({ ...content, description: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none transition-all h-32 resize-none font-medium text-sm leading-relaxed"
                />
              ) : (
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={content.url || ''}
                  onChange={(e) => setContent({ ...content, url: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none transition-all font-mono text-sm"
                />
              )}
            </section>
          )}

          {/* 4. MEDIA SECTION */}
          {(widget.type === 'image' || widget.type === 'profile') && (
            <section className="space-y-4">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">
                {widget.type === 'profile' ? 'Profile Picture' : 'Visuals'}
              </label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group aspect-square rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${widget.type === 'profile' ? 'w-32 h-32 mx-auto rounded-full' : 'w-full'}`}
              >
                {content.imageUrl ? (
                  <>
                    <Image 
                      src={content.imageUrl} 
                      alt="Preview" 
                      fill 
                      className={`object-cover object-${content.objectPosition || 'center'} transition-transform group-hover:scale-110 duration-500`} 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="text-white" size={24} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-zinc-400">
                    {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                    <p className="text-[10px] mt-2 font-bold uppercase tracking-tighter">Upload</p>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

              {widget.type === 'image' && content.imageUrl && (
                <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                  {['top', 'center', 'bottom'].map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setContent({ ...content, objectPosition: pos })}
                      className={`flex-1 py-1.5 rounded-lg capitalize text-[10px] font-bold transition-all ${
                        content.objectPosition === pos 
                          ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' 
                          : 'text-zinc-500 hover:text-zinc-700'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <button
            onClick={handleSave}
            disabled={loading || uploading}
            className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-transform active:scale-95 shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? 'Processing...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}