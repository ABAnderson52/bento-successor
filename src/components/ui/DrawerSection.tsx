import React from 'react'

interface DrawerSectionProps {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}

export function DrawerSection({ label, icon, children }: DrawerSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}
        <label className="text-xs font-bold uppercase tracking-widest">{label}</label>
      </div>
      {children}
    </section>
  )
}