import React from 'react'
import { Save, Loader2 } from 'lucide-react'

interface WidgetDrawerFooterProps {
  onSave: () => void
  loading: boolean
  disabled?: boolean
}

export function WidgetDrawerFooter({ onSave, loading, disabled }: WidgetDrawerFooterProps) {
  return (
    <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <button
        onClick={onSave}
        disabled={disabled || loading}
        className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 transition-transform active:scale-95 shadow-xl"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {loading ? 'Processing...' : 'Save Changes'}
      </button>
    </div>
  )
}