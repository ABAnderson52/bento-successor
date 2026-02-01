import { SOCIAL_PLATFORMS } from '@/lib/constants'
import { Widget } from '@/types'
import { extractHandle } from '@/lib/utils'

export function SocialTile({ widget }: { widget: Widget }) {
  const platformKey = widget.content?.platform as keyof typeof SOCIAL_PLATFORMS
  const platform = platformKey ? SOCIAL_PLATFORMS[platformKey] : null

  if (!platform) return null

  const url = widget.content?.url || ''
  const handle = extractHandle(url, platformKey)
  
  const isGeneric = widget.content?.title?.toLowerCase() === platform.name.toLowerCase()
  const displayTitle = (!isGeneric && widget.content?.title) || handle || ""

  const isWide = widget.w === 2
  const isTall = widget.h === 2

  return (
    <div className="flex flex-col justify-between h-full w-full p-5">
      {/* 1. Icon - Slightly smaller to increase whitespace */}
      <div 
        className={`
          flex items-center justify-center rounded-xl text-white shadow-sm
          ${platform.color} 
          ${isWide || isTall ? 'h-12 w-12' : 'h-10 w-10'}
        `}
      >
        <platform.icon size={isWide || isTall ? 24 : 20} />
      </div>

      {/* 2. Content Block */}
      <div className={`flex flex-col ${isWide && !isTall ? 'flex-row items-center justify-between gap-4' : 'gap-2.5'}`}>
        <div className="min-w-0 flex-1">
          <h3 
            className={`
              font-bold leading-tight tracking-tight truncate
              ${isWide || isTall ? 'text-2xl' : 'text-lg'}
              ${!displayTitle ? 'opacity-20' : 'opacity-100'}
            `}
          >
            {displayTitle || "@handle"}
          </h3>
        </div>
        
        <div 
          className={`
            rounded-xl text-[13px] font-bold text-white shadow-sm transition-transform active:scale-95
            ${platform.color} 
            ${isWide && !isTall ? 'w-fit px-5 py-2' : 'w-full py-2 text-center'}
          `}
        >
          {platform.cta}
        </div>
      </div>
    </div>
  )
}