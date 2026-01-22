import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function IndexPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/editor')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <header className="fixed top-0 w-full p-6 flex justify-between items-center max-w-7xl">
        <div className="font-bold text-xl tracking-tighter">BENTO_GEN</div>
        <Link href="/login" className="text-sm font-medium hover:opacity-70">
          Sign In
        </Link>
      </header>

      <main className="space-y-6 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          Your digital garden, <br />
          <span className="text-zinc-400">perfectly arranged.</span>
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl">
          A spiritual successor to the art of the grid. Built for the community, by the community.
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <Link 
            href="/register" 
            className="bg-black dark:bg-white dark:text-black text-white px-8 py-3 rounded-full font-medium transition-transform hover:scale-105"
          >
            Claim your username
          </Link>
        </div>
      </main>
    </div>
  )
}