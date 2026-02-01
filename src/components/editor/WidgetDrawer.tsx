'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Widget, WidgetContent, SocialPlatform } from '@/types'
import { Upload, User, Layout, Type, Settings, Loader2 } from 'lucide-react'
import { updateWidgetContent, uploadWidgetImage, deleteStorageFile } from '@/app/(auth)/actions'
import { SOCIAL_PLATFORMS } from '@/lib/constants'
import { toast } from 'sonner'
import { DrawerSection } from '@/components/ui/DrawerSection'
import { WidgetInput } from '@/components/ui/WidgetInput'
import { WidgetButtonGroup } from '@/components/ui/WidgetButtonGroup'
import { WidgetDrawerHeader } from '@/components/ui/WidgetDrawerHeader'
import { WidgetDrawerFooter } from '@/components/ui/WidgetDrawerFooter'

interface WidgetDrawerProps {
  widget: Widget
  isOpen: boolean
  onClose: () => void
  liveContent: WidgetContent
  setLiveContent: (content: WidgetContent) => void
  liveDimensions: { w: number; h: number }
  setLiveDimensions: (dims: { w: number; h: number }) => void
}

export function WidgetDrawer({ 
  widget, 
  isOpen, 
  onClose,
  liveContent,
  setLiveContent,
  liveDimensions,
  setLiveDimensions
}: WidgetDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const uploadAction = async () => {
      if (liveContent.imageUrl) await deleteStorageFile(liveContent.imageUrl)
      const publicUrl = await uploadWidgetImage(formData)
      setLiveContent({ ...liveContent, imageUrl: publicUrl, objectPosition: 'center' })
      return publicUrl
    }

    toast.promise(uploadAction(), {
      loading: 'Uploading image...',
      success: 'Image uploaded successfully',
      error: 'Upload failed. Max 5MB.',
      finally: () => setUploading(false)
    })
  }

  const handleSave = async () => {
    setLoading(true)
    const saveAction = async () => {
      const finalContent = { ...liveContent }
      if (widget.type === 'link' && liveContent.url) {
        try {
          const domain = new URL(liveContent.url).hostname
          finalContent.iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        } catch (urlErr) { console.error("Invalid URL", urlErr) }
      }
      await updateWidgetContent(widget.id, finalContent, liveDimensions)
      onClose()
      return 'Updated'
    }

    toast.promise(saveAction(), {
      loading: 'Saving changes...',
      success: 'Widget updated successfully',
      error: 'Failed to update widget',
      finally: () => setLoading(false)
    })
  }

  return (
    <div className="fixed inset-0 z-1100 flex justify-end pointer-events-none">
      <div className="absolute inset-0 bg-transparent" />
      <div className="relative w-full max-w-md h-screen bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-500 ease-out pointer-events-auto">
        
        <WidgetDrawerHeader 
          title={`Edit ${widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}`} 
          onClose={onClose} 
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
          {widget.type === 'profile' && (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Manage Profile Data</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Synced from account settings.</p>
              </div>
              <Link href="/settings" className="flex items-center gap-2 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-black uppercase rounded-xl">
                <Settings size={12} /> Settings
              </Link>
            </div>
          )}

          <DrawerSection label="Tile Configuration" icon={<Layout size={14} />}>
            <WidgetButtonGroup 
              activeValue={`${liveDimensions.w}x${liveDimensions.h}`}
              onChange={(val) => {
                const [w, h] = val.split('x').map(Number);
                setLiveDimensions({ w, h });
              }}
              options={[
                { label: 'Square', value: '1x1' },
                { label: 'Wide', value: '2x1' },
                { label: 'Tall', value: '1x2' },
              ]}
            />
          </DrawerSection>

          {widget.type !== 'profile' && (
            <DrawerSection 
              label={widget.type === 'social' ? 'Social Link' : widget.type === 'text' ? 'Text Content' : 'Identity'} 
              icon={widget.type === 'text' ? <Type size={14} /> : <User size={14} />}
            >
              {widget.type === 'social' && (
                <div className="mb-4">
                  <WidgetButtonGroup<SocialPlatform | undefined> 
                    columns={2}
                    activeValue={liveContent.platform}
                    onChange={(p) => setLiveContent({ 
                      ...liveContent, 
                      platform: p,
                    })}
                    options={Object.entries(SOCIAL_PLATFORMS).map(([key, p]) => ({
                      label: p.name, value: key as SocialPlatform, icon: React.createElement(p.icon, { size: 16 })
                    }))}
                  />
                </div>
              )}
              
              {/* Only show title field for non-social widgets */}
              {widget.type !== 'social' && (
                <WidgetInput 
                  placeholder="Title" 
                  value={liveContent.title || ''} 
                  onChange={(val) => setLiveContent({ ...liveContent, title: val })} 
                />
              )}
            </DrawerSection>
          )}

          {(widget.type === 'link' || widget.type === 'social' || widget.type === 'text') && (
            <DrawerSection label={widget.type === 'text' ? 'Description' : 'Destination'}>
              <WidgetInput 
                type={widget.type === 'text' ? 'textarea' : 'url'}
                placeholder={widget.type === 'text' ? "Write something..." : "https://..."}
                value={(widget.type === 'text' ? liveContent.description : liveContent.url) || ''}
                onChange={(val) => setLiveContent({ ...liveContent, [widget.type === 'text' ? 'description' : 'url']: val })}
              />
            </DrawerSection>
          )}

          {widget.type === 'image' && (
            <DrawerSection label="Visuals">
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="relative group aspect-square rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 w-full"
              >
                {liveContent.imageUrl ? (
                  <Image src={liveContent.imageUrl} alt="Preview" fill className={`object-cover object-${liveContent.objectPosition || 'center'}`} />
                ) : (
                  <div className="flex flex-col items-center text-zinc-400">
                    {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              {liveContent.imageUrl && (
                <div className="mt-4">
                  <WidgetButtonGroup 
                    activeValue={liveContent.objectPosition || 'center'}
                    onChange={(pos) => setLiveContent({ ...liveContent, objectPosition: pos })}
                    options={[{ label: 'Top', value: 'top' }, { label: 'Center', value: 'center' }, { label: 'Bottom', value: 'bottom' }]}
                  />
                </div>
              )}
            </DrawerSection>
          )}
        </div>

        <WidgetDrawerFooter onSave={handleSave} loading={loading} disabled={uploading} />
      </div>
    </div>
  )
}