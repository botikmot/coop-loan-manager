//import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { supabase } from "./src/lib/supabase"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  /* const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          const cookie = req.cookies.get(name)
          return cookie ? cookie.value : null
        },
        set() {},
        remove() {},
      },
    }
  ) */

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  const isAuthPage = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")
  const isSubscribePage = pathname.startsWith("/subscribe")

  // ✅ Allow anyone to access subscribe page
  if (isSubscribePage) {
    return res
  }

  // ✅ Redirect unauthenticated users away from protected pages
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // ✅ Redirect logged-in users away from auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // --------------------------
  // Only check subscription for logged-in users
  // --------------------------
  if (session) {
    const { data: userProfile } = await supabase
      .from("users")
      .select(`
        coop_id,
        cooperatives (
          trial_ends_at,
          subscription_status,
          subscription_ends_at,
          grace_period_days,
          is_early_client
        )
      `)
      .eq("id", session.user.id)
      .single()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coop = (userProfile as any)?.cooperatives
    const now = new Date()

    if (coop) {
      const trialExpired =
        coop.subscription_status === "trial" &&
        coop.trial_ends_at &&
        now > new Date(coop.trial_ends_at)

      const subscriptionExpired =
        coop.subscription_status === "active" &&
        coop.subscription_ends_at &&
        now > new Date(coop.subscription_ends_at)

      const hasAccess =
        coop?.is_lifetime ||
        (!trialExpired && coop.subscription_status === "trial") ||
        (coop.subscription_status === "active" && !subscriptionExpired)

      // 🚫 Redirect users without access
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/subscribe", req.url))
      }
    }
  }

  return res
}

// Only apply middleware to protected paths
export const config = {
  matcher: ["/dashboard/:path*", "/other-protected/:path*"],
}