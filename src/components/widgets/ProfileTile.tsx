import Image from 'next/image'
import { User, MapPin, Globe } from 'lucide-react'
import { Profile } from '@/types'

export function ProfileTile({ profile }: { profile: Profile }) {
  const getValidUrl = (url: string) => {
    if (!url) return ''
    return url.startsWith('http') ? url : `https://${url}`
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 h-full w-full">
      <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-full border-2 border-white dark:border-zinc-800 shadow-sm bg-zinc-100 dark:bg-zinc-800">
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-400">
            <User size={32} />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center text-center md:text-left overflow-hidden">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
          {profile?.display_name || "Your Name"}
        </h2>

        {/* Location and Clickable Website Row */}
        {(profile?.location || profile?.website_url) && (
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-1">
            {profile.location && (
              <div className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <MapPin size={12} className="shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}
            
            {profile.website_url && (
              <a 
                href={getValidUrl(profile.website_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-600 hover:underline transition-all cursor-pointer relative z-50"
                onPointerDownCapture={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <Globe size={12} className="shrink-0" />
                <span className="truncate max-w-37.5">
                  {profile.website_url.replace(/(^\w+:|^)\/\//, '')}
                </span>
              </a>
            )}
          </div>
        )}

        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
          {profile?.bio || "Write a short bio about yourself..."}
        </p>
      </div>
    </div>
  )
}