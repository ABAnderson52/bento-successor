import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, Settings as SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { ProfileForm } from '@/components/settings/ProfileForm'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <main className="max-w-7xl mx-auto p-6 lg:p-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="md:col-span-4 space-y-2">
          <div className="mb-6 px-4">
            <h1 className="text-sm font-black uppercase tracking-widest opacity-30">Settings</h1>
          </div>
          <nav className="flex flex-col gap-1">
            <Link 
              href="/settings" 
              className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 font-bold text-sm"
            >
              <User size={18} />
              Profile
            </Link>
            <button disabled className="flex items-center gap-3 px-4 py-3 text-zinc-400 font-bold text-sm cursor-not-allowed opacity-50">
              <SettingsIcon size={18} />
              Account
            </button>
          </nav>
        </aside>

        {/* Settings Content Area */}
        <div className="md:col-span-8">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Public Profile</h2>
              <p className="text-zinc-500 text-sm mt-1">This is how the world will see you on your grid.</p>
            </div>

            <ProfileForm profile={profile} />
          </div>
        </div>
      </div>
    </main>
  )
}