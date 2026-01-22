import { signup } from '../actions'
import Link from 'next/link'

export default async function RegisterPage(props: { 
  searchParams: Promise<{ error?: string }> 
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="space-y-6">
      {/* 1. Corrected Header for Registration */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-zinc-500">Join the community to start building</p>
      </div>

      <form className="space-y-4">
        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            placeholder="johndoe"
            className="w-full px-3 py-2 border rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-black dark:border-zinc-800 transition-all"
            required
          />
        </div>
        
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            className="w-full px-3 py-2 border rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-black dark:border-zinc-800 transition-all"
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-black dark:border-zinc-800 transition-all"
            required
          />
        </div>

        {/* Error Messaging */}
        {searchParams?.error && (
          <p className="text-sm text-red-500 font-medium">
            {searchParams.error}
          </p>
        )}

        <button 
          formAction={signup}
          className="w-full bg-black dark:bg-white dark:text-black text-white p-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          Create Account
        </button>
      </form>

      {/* Link back to Login */}
      <div className="text-center text-sm">
        <Link href="/login" className="text-zinc-500 hover:underline">
          Already have an account? <span className="text-black dark:text-white font-medium">Sign in</span>
        </Link>
      </div>
    </div>
  )
}