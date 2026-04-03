import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple JWT decoder for the edge (middleware)
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('mealops_jwt')?.value

  // 1. Protection for /app/* (Student)
  if (pathname.startsWith('/app')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const payload = parseJwt(token)
    if (!payload || payload.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. Protection for /admin/* (Admin)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    const payload = parseJwt(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 3. Redirect logged-in users away from /login
  if ((pathname === '/login' || pathname === '/admin/login') && token) {
     const payload = parseJwt(token)
     if (payload) {
        const dest = payload.role === 'ADMIN' ? '/admin/dashboard' : '/app/dashboard'
        return NextResponse.redirect(new URL(dest, request.url))
     }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*', '/login', '/admin/login'],
}
