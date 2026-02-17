"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SubscribeContent from "./SubscribeContent"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/src/lib/supabase"

export default function SubscribePageClient() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [coop, setCoop] = useState<any>(null)
  const [graceRemaining, setGraceRemaining] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      // Redirect if not logged in
      if (!session) {
        router.push("/auth/login")
        return
      }

      setSession(session)

       const { data } = await supabase
            .from("users")
            .select("coop_id")
            .eq("id", session.user.id)
            .single()

      // Fetch cooperative profile
      const { data: profile, error } = await supabase
        .from("cooperatives")
        .select("*")
        .eq("id", data?.coop_id)
        .single()

      if (error || !profile) {
        console.error("Cooperative not found:", error)
        setLoading(false)
        return
      }

      setCoop(profile)

      // Calculate grace period
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
  }, [router])

  if (loading) return <p className="p-6">Loading...</p>
  if (!session) return null  // redirect is handled
  if (!coop) return <p className="p-6 text-red-500">Cooperative not found.</p>

  return <SubscribeContent coop={coop} graceRemaining={graceRemaining} />
}