import Image from 'next/image'
import { Widget } from '@/types'

export function ImageTile({ widget }: { widget: Widget }) {
  return (
    <>
      {widget.content?.imageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden rounded-4xl">
          <Image 
            src={widget.content.imageUrl} 
            alt={widget.content.title || ""}
            fill
            className={`object-cover object-${widget.content.objectPosition || 'center'}`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        </div>
      )}
      
      <div className="relative z-10 mt-auto">
        <h3 className="font-bold text-xl leading-tight tracking-tight text-white drop-shadow-md">
          {widget.content?.title}
        </h3>
      </div>
    </>
  )
}