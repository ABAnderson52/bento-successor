'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, LogOut, ShieldCheck, User } from 'lucide-react'
import { signOut } from '@/app/(auth)/actions'
import { Profile } from '@/types'

interface GlobalNavProps {
  profile: Profile | null;
}

export function GlobalNav({ profile }: GlobalNavProps) {
  const pathname = usePathname()

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo & Platform Name */}
          <Link href="/editor" className="flex items-center gap-3 group">
            <div className="h-8 w-8 bg-black dark:bg-zinc-200 rounded-lg shadow-sm group-hover:scale-105 transition-transform" />
            <span className="font-bold tracking-tighter text-xl uppercase">Editor</span>
          </Link>

          {profile?.role === 'admin' && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase border border-amber-200">
              <ShieldCheck size={12} /> Admin
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          {/* User Handle */}
          <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500">
            <User size={16} />
            <span>@{profile?.username}</span>
          </div>

          {/* Navigation Links */}
          <Link
            href="/settings"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              pathname === '/settings' 
                ? 'text-zinc-900 dark:text-zinc-100' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Settings size={16} />
            <span>Settings</span>
          </Link>

          {/* Logout Action */}
          <form action={signOut}>
            <button className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-500 transition-colors">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}