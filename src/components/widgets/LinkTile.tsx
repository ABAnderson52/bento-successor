import Image from 'next/image'
import { Globe } from 'lucide-react'
import { Widget } from '@/types'

export function LinkTile({ widget }: { widget: Widget }) {
  const displayUrl = widget.content?.url 
    ? widget.content.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : 'Website'

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="h-12 w-12 flex items-center justify-center rounded-2xl shadow-sm bg-white dark:bg-zinc-100 text-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden relative">
        {widget.content?.iconUrl ? (
          <Image 
            src={widget.content.iconUrl as string} 
            alt="" 
            fill
            className="object-contain p-2.5"
            unoptimized 
          />
        ) : (
          <Globe size={24} className="text-zinc-400" />
        )}
      </div>

      <div className="mt-auto">
        <h3 className="font-bold text-xl leading-tight tracking-tight">
          {widget.content?.title || "Visit Link"}
        </h3>
        <p className="text-xs font-medium text-zinc-400 truncate mt-1">
          {displayUrl}
        </p>
      </div>
    </div>
  )
}