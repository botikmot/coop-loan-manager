import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next()
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          })
          res = NextResponse.next()
          res.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/auth/login") ||
    req.nextUrl.pathname.startsWith("/auth/register")

  const isSubscribePage = req.nextUrl.pathname.startsWith("/subscribe")

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // ✅ If logged in, check subscription
  if (session) {
    const { data: userProfile } = await supabase
      .from("users")
      .select(`
        coop_id,
        cooperatives (
          trial_ends_at,
          subscription_status,
          subscription_ends_at,
        )
      `)
      .eq("id", session.user.id)
      .single()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coop = (userProfile as any)?.cooperatives
    const now = new Date()

    const trialExpired =
      coop?.trial_ends_at &&
      new Date(coop.trial_ends_at) < now

    /* const subscriptionExpired =
      coop?.subscription_status !== "active" ||
      (coop?.subscription_ends_at &&
        new Date(coop.subscription_ends_at) < now) */

    const hasAccess =
      coop?.is_lifetime ||
      (!trialExpired) ||
      coop?.subscription_status === "active"

    // 🚫 BLOCK ACCESS IF EXPIRED
    if (!hasAccess && !isSubscribePage) {
      return NextResponse.redirect(new URL("/subscribe", req.url))
    }

    // ✅ If subscribed and trying to access subscribe page → go dashboard
    if (hasAccess && isSubscribePage) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }


  return res
}