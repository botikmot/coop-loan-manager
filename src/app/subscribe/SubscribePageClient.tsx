"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from '@supabase/supabase-js'
import SubscribeContent from "./SubscribeContent"
import type { Session } from "@supabase/supabase-js"

export default function SubscribePageClient() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [coop, setCoop] = useState<any>(null)
  const [graceRemaining, setGraceRemaining] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log("session inside useEffect:", session)

      if (!session) {
        router.push("/auth/login")
        return
      }

      setSession(session)

      const { data: profile, error } = await supabase
        .from("cooperatives")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (error || !profile) {
        setLoading(false)
        return
      }

      setCoop(profile)

      const now = new Date()
      const endDate = profile.subscription_ends_at ?? profile.trial_ends_at
      let grace = 0
      if (endDate) {
        const graceMs = (profile.grace_period_days ?? 3) * 24 * 60 * 60 * 1000
        const graceEnd = new Date(new Date(endDate).getTime() + graceMs)
        grace = Math.max(0, Math.ceil((graceEnd.getTime() - now.getTime()) / (1000*60*60*24)))
      }
      setGraceRemaining(grace)
      setLoading(false)
    }

    fetchData()
  }, [router, supabase])

  if (loading) return <p>Loading...</p>
  if (!session) return null
  if (!coop) return <p>Cooperative not found</p>

  return <SubscribeContent coop={coop} graceRemaining={graceRemaining} />
}