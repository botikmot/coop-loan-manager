"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { supabase } from "@/src/lib/supabase"
import { useState } from "react"

interface SubscribeContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  coop: any
  graceRemaining: number
}

export default function SubscribeContent({ coop, graceRemaining }: SubscribeContentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async () => {
    setLoading(true)
    setError(null)
    console.log('coopID::',coop.id)
    try {
      const newEnd = new Date()
      newEnd.setMonth(newEnd.getMonth() + 1)

      const { data, error } = await supabase
        .from("cooperatives")
        .update({
          subscription_status: "active",
          subscription_ends_at: newEnd.toISOString(),
        })
        .eq("id", coop.id)

        console.log("update result:", { data, error })

      if (error) {
        setError(error.message)
        return
      }

      // ✅ redirect after successful subscription
      router.push("/dashboard")
    } catch (err) {
      setError((err as Error).message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-bold">Subscription Required</h1>

      {(coop?.subscription_status === "trial" || coop?.subscription_status === "active") && graceRemaining > 0 && (
        <p className="text-yellow-700">
          Your {coop?.subscription_status} has expired, but you have {graceRemaining} day(s) of grace period left.
          Please renew your subscription to continue uninterrupted access.
        </p>
      )}

      {(!graceRemaining || graceRemaining <= 0) && (
        <p className="text-red-600">
          Your {coop?.subscription_status} has expired. Please subscribe to continue using the system.
        </p>
      )}

      {error && <p className="text-red-600">{error}</p>}

      <Button className="w-full" onClick={handleSubscribe} disabled={loading}>
        {loading ? "Processing..." : "Subscribe Now"}
      </Button>
    </div>
  )
}