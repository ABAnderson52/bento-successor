import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GlobalNav } from '@/components/navigation/GlobalNav'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
      <GlobalNav profile={profile} />
      {children}
    </div>
  )
}