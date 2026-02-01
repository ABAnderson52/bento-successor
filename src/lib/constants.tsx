export const SOCIAL_PLATFORMS: Record<string, PlatformConfig> = {
  "instagram": {
    name: 'Instagram',
    color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    subtleColor: 'bg-[#ee2a7b]/10',
    textColor: 'text-[#ee2a7b] dark:text-[#f9ce34]',
    cta: 'Follow',
    icon: ({ size = 24, ...props }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} {...props}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  "twitter": {
    name: 'X',
    color: 'bg-black dark:bg-white',
    subtleColor: 'bg-zinc-100 dark:bg-zinc-800/50',
    textColor: 'text-zinc-900 dark:text-zinc-100',
    cta: 'View Profile',
    icon: ({ size = 24, ...props }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  "tiktok": {
    name: 'TikTok',
    color: 'bg-zinc-950 dark:bg-white', 
    subtleColor: 'bg-zinc-100 dark:bg-zinc-800/50',
    textColor: 'text-zinc-900 dark:text-zinc-100',
    cta: 'Watch',
    icon: ({ size = 24, ...props }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23.84-.16 1.74.28 2.48.48.81 1.37 1.39 2.28 1.51.95.12 1.98-.08 2.76-.67.64-.47 1.05-1.18 1.15-1.96.02-3.07-.01-6.13.01-9.2z"/>
      </svg>
    )
  },
  "youtube": {
    name: 'YouTube',
    color: 'bg-[#FF0000]',
    subtleColor: 'bg-[#FF0000]/10',
    textColor: 'text-[#FF0000]',
    cta: 'Subscribe',
    icon: ({ size = 24, ...props }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  },
  "github": {
    name: 'GitHub',
    color: 'bg-[#24292e] dark:bg-zinc-700',
    subtleColor: 'bg-zinc-100 dark:bg-zinc-800/50',
    textColor: 'text-[#24292e] dark:text-zinc-100',
    cta: 'Star',
    icon: ({ size = 24, ...props }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    )
  },
  "linkedin": {
    name: 'LinkedIn',
    color: 'bg-[#0077b5]',
    subtleColor: 'bg-[#0077b5]/10',
    textColor: 'text-[#0077b5]',
    cta: 'Connect',
    icon: ({ size = 24, ...props }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
      </svg>
    )
  }
};