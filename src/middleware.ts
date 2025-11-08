import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // --- 1. HANDLE USERS WHO ARE NOT LOGGED IN ---
  if (!user) {
    // If a non-logged-in user tries to access any protected route, redirect to login
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Allow them to access login, signup, or home page
    return response
  }

  // --- 2. HANDLE LOGGED-IN USERS ---

  // Get the user's role. We check the "Admin" table, just like your is_admin() function.
  // This is a fast, indexed query.
  const { data: adminData } = await supabase
    .from('Admin')
    .select('id')
    .eq('id', user.id)
    .single()

  const isAdmin = !!adminData

  // --- 2a. Admin Routing ---
  if (isAdmin) {
    // If an admin tries to access the scholar dashboard, redirect to admin dashboard
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    // If an admin is on a login/signup page, redirect to admin dashboard
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    // If an admin is accessing an /admin route, let them pass
    if (pathname.startsWith('/admin')) {
      return response
    }
  }

  // --- 2b. Scholar Routing ---
  if (!isAdmin) {
    // If a scholar tries to access any /admin route, redirect to scholar dashboard
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/scholar/dashboard', request.url))
    }
    // If a scholar is on a login/signup page, redirect to scholar dashboard
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/scholar/dashboard', request.url))
    }
  }

  // Default: let them pass (e.g., to the home page '/')
  return response
}

// Config to specify which routes the middleware should run on.
// This regex avoids running on static files and API routes.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to add more paths here (e.g., /api routes)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}