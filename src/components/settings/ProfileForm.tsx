'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Save, Loader2, AtSign, User, FileText, Upload, Camera, CheckCircle2, XCircle, MapPin, Globe } from 'lucide-react'
import { updateProfile, uploadWidgetImage, deleteStorageFile, checkUsernameAvailability } from '@/app/(auth)/actions'
import { Profile } from '@/types'

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  const [formData, setFormData] = useState({
    username: profile?.username || '',
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
    location: profile?.location || '', 
    website_url: profile?.website_url || '', 
  })

  useEffect(() => {
    if (!formData.username || formData.username === profile?.username) {
      setIsAvailable(null)
      return
    }

    const timer = setTimeout(async () => {
      setIsChecking(true)
      try {
        const available = await checkUsernameAvailability(formData.username)
        setIsAvailable(available)
      } catch (err) {
        console.error(err)
      } finally {
        setIsChecking(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [formData.username, profile?.username])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    const data = new FormData()
    data.append('file', file)

    const uploadAction = async () => {
      if (formData.avatar_url) await deleteStorageFile(formData.avatar_url)
      const publicUrl = await uploadWidgetImage(data)
      setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
      return publicUrl
    }

    toast.promise(uploadAction(), {
      loading: 'Uploading avatar...',
      success: 'Avatar uploaded!',
      error: 'Upload failed',
      finally: () => setUploading(false)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isAvailable === false) {
      toast.error("Please choose an available username")
      return
    }

    setLoading(true)

    const savePromise = async () => {
      // We pass the display_name to updateProfile as 'full_name' 
      // to maintain compatibility with your existing action argument names
      await updateProfile({
        ...formData,
        full_name: formData.display_name 
      })

      router.refresh()
      return "Profile updated"
    }

    toast.promise(savePromise(), {
      loading: 'Saving your profile...',
      success: 'Profile updated successfully!',
      error: (err) => `Update failed: ${err.message}`,
      finally: () => setLoading(false)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar Upload Section */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative group w-24 h-24 rounded-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-950"
        >
          {formData.avatar_url ? (
            <>
              <Image 
                src={formData.avatar_url} 
                alt="Avatar" 
                fill 
                className="object-cover transition-transform group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white" size={20} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-zinc-400">
              {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            </div>
          )}
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Profile Picture</label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
            <div className="flex items-center gap-2"><AtSign size={14} /> Username</div>
            {isChecking && <Loader2 size={12} className="animate-spin" />}
            {!isChecking && isAvailable === true && <span className="text-emerald-500 flex items-center gap-1 normal-case font-medium"><CheckCircle2 size={12} /> Available</span>}
            {!isChecking && isAvailable === false && <span className="text-red-500 flex items-center gap-1 normal-case font-medium"><XCircle size={12} /> Taken</span>}
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
            className={`w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border focus:ring-2 outline-none transition-all font-medium ${
              isAvailable === false ? 'border-red-500/50 focus:ring-red-500/20' : 'border-zinc-200 dark:border-zinc-800 focus:ring-zinc-500'
            }`}
            placeholder="johndoe"
            required
          />
        </div>

        {/* Display Name Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <User size={14} /> Display Name
          </label>
          <input
            type="text"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none transition-all font-medium"
            placeholder="John Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin size={14} /> Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none transition-all font-medium"
            placeholder="New York, NY"
          />
        </div>

        {/* Website Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Globe size={14} /> Website
          </label>
          <input
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none transition-all font-medium"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      {/* Bio Field */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <FileText size={14} /> Short Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-zinc-500 outline-none transition-all h-32 resize-none font-medium text-sm leading-relaxed"
          placeholder="Product Designer & Developer based in..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || uploading || isAvailable === false}
        className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-[0.98] shadow-xl hover:shadow-zinc-500/10"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}