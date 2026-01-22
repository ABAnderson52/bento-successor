'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { WidgetType } from '@/types'
import { v4 as uuidv4 } from 'uuid'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return redirect('/login?error=' + encodeURIComponent(error.message))
  
  redirect('/editor')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, display_name: username } },
  })

  if (error) return redirect('/login?error=' + encodeURIComponent(error.message))
  return redirect('/login?message=Check your email to confirm')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function addWidget(type: WidgetType) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const dimensions: Record<WidgetType, { w: number, h: number }> = {
    profile: { w: 2, h: 2 },
    social: { w: 1, h: 1 },
    link: { w: 1, h: 1 },
    image: { w: 2, h: 2 },
    text: { w: 2, h: 1 },
    map: { w: 2, h: 2 }
  }

  const { w, h } = dimensions[type]

  const { error } = await supabase
    .from('widgets')
    .insert({
      user_id: user.id,
      type,
      x: 0,
      y: 0,
      w,
      h,
      content: {
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: type === 'profile' ? 'Tell the world who you are.' : '',
      }
    })

  if (error) {
    console.error("Failed to add widget:", error.message)
    throw new Error("Could not create widget")
  }

  revalidatePath('/editor')
}

export async function deleteWidget(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('widgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Delete error:', error.message)
    throw new Error('Failed to delete widget')
  }

  revalidatePath('/editor')
}

export async function updateWidgetOrder(widgets: { id: string, created_at: string }[]) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updates = widgets.map((w) => 
    supabase
      .from('widgets')
      .update({ created_at: w.created_at })
      .eq('id', w.id)
      .eq('user_id', user.id)
  )

  const results = await Promise.all(updates)

  const firstError = results.find(r => r.error)
  if (firstError) {
    console.error("Order update error:", firstError.error?.message)
    throw new Error("Failed to persist new order")
  }

  revalidatePath('/editor')
}

interface WidgetUpdatePayload {
  content: Record<string, unknown>;
  w?: number;
  h?: number;
}

export async function updateWidgetContent(
  id: string, 
  content: Record<string, unknown>,
  dimensions?: { w: number; h: number }
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const updateData: WidgetUpdatePayload = { content }
  
  if (dimensions) {
    updateData.w = dimensions.w
    updateData.h = dimensions.h
  }

  const { error } = await supabase
    .from('widgets')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Update error:', error.message)
    throw new Error('Failed to update widget')
  }

  revalidatePath('/editor')
}

export async function uploadWidgetImage(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  const MAX_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (file.size > MAX_SIZE) {
    throw new Error('File size must be less than 5MB')
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF are allowed')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${uuidv4()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('widget-assets')
    .upload(fileName, file)

  if (error) {
    console.error('Upload error:', error.message)
    throw new Error('Failed to upload image')
  }

  const { data: { publicUrl } } = supabase.storage
    .from('widget-assets')
    .getPublicUrl(data.path)

  return publicUrl
}

export async function deleteStorageFile(publicUrl: string) {
  const supabase = await createClient()

  const pathParts = publicUrl.split('/widget-assets/')
  if (pathParts.length < 2) return

  const filePath = pathParts[1]

  const { error } = await supabase.storage
    .from('widget-assets')
    .remove([filePath])

  if (error) {
    console.error('Cleanup error:', error.message)
  }
}

export async function getFavicon(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}