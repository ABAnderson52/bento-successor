import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut, addWidget } from '../(auth)/actions'
import { LogOut, ShieldCheck, User, Plus } from 'lucide-react'
import { Widget } from '@/types'
import { ClientEditorWrapper } from '@/components/editor/ClientEditorWrapper'

export const dynamic = 'force-dynamic'

export default async function EditorPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const [profileResponse, widgetsResponse] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('widgets').select('*').eq('user_id', user.id).order('created_at', { ascending: true })
  ])

  const profile = profileResponse.data
  const widgets: Widget[] = widgetsResponse.data || []
  const isEmpty = widgets.length === 0

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 pb-24">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold tracking-tighter text-xl uppercase">Editor</span>
            {profile?.role === 'admin' && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase border border-amber-200">
                <ShieldCheck size={12} /> Admin
              </span>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <User size={16} />
              <span>@{profile?.username}</span>
            </div>
            <form action={signOut}>
              <button className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-500 transition-colors">
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12 relative z-0">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="h-16 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-2xl mb-6 flex items-center justify-center text-zinc-400">
                <Plus size={32} />
            </div>
            <h2 className="text-xl font-medium mb-2">Your grid is empty</h2>
            <p className="text-zinc-500 text-center max-w-xs">
              Start adding widgets using the dock below to showcase your work.
            </p>
          </div>
        ) : (
          <ClientEditorWrapper initialWidgets={widgets} onAdd={addWidget} />
        )}
      </main>
    </div>
  )
}