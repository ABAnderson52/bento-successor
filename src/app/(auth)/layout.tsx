export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#050505] p-4">
      {/* Brand Logo - Same for both */}
      <div className="h-12 w-12 bg-black dark:bg-zinc-200 rounded-2xl mb-8 shadow-sm" />
      
      {/* The White/Dark Box */}
      <div className="w-full max-w-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm">
        {children}
      </div>
    </div>
  )
}