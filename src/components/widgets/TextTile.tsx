import { Widget } from '@/types'

export function TextTile({ widget }: { widget: Widget }) {
  return (
    <div className="flex flex-col h-full">
      {/* Optional: Icon or Label for Text widgets */}
      <div className="flex items-center justify-between mb-4">
        <div className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Note
        </div>
      </div>

      <div className="mt-auto">
        <h3 className="font-bold text-xl leading-tight tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          {widget.content?.title || "Untitled Note"}
        </h3>
        
        {widget.content?.description && (
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-4 leading-relaxed">
            {widget.content.description}
          </p>
        )}
      </div>
    </div>
  )
}