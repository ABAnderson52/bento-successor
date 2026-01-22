import { login } from '../actions'
import Link from 'next/link'

export default async function LoginPage(props: { 
  searchParams: Promise<{ message?: string; error?: string }> 
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-zinc-500">Enter your details to sign in to your account</p>
      </div>

      <form className="space-y-4">
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
            className="w-full px-3 py-2 border rounded-lg bg-transparent focus:ring-2 focus:ring-black outline-none transition-all dark:border-zinc-800"
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
            className="w-full px-3 py-2 border rounded-lg bg-transparent focus:ring-2 focus:ring-black outline-none transition-all dark:border-zinc-800"
            required
          />
        </div>

        {/* Status Messages */}
        {searchParams?.error && (
          <p className="text-sm text-red-500 font-medium">
            {searchParams.error}
          </p>
        )}
        
        {searchParams?.message && (
          <p className="text-sm text-green-600 font-medium">
            {searchParams.message}
          </p>
        )}

        <button 
          formAction={login}
          className="w-full bg-black dark:bg-white dark:text-black text-white p-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      {/* 2. Link to Register */}
      <div className="text-center text-sm">
        <span className="text-zinc-500">Don&apos;t have an account? </span>
        <Link href="/register" className="font-medium hover:underline text-black dark:text-white">
          Create one for free
        </Link>
      </div>
    </div>
  )
}