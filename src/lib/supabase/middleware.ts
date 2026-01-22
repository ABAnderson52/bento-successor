export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // This ensures the cookies are available to the rest of the request lifecycle
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          
          // Re-create the response to include the new cookies
          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: This call refreshes the session if it's expired
  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes logic
  if (!user && 
      !request.nextUrl.pathname.startsWith('/login') && 
      request.nextUrl.pathname !== '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}