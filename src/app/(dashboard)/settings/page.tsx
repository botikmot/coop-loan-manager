"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/src/lib/supabase"
import { getUserCoopId } from "@/src/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [coop, setCoop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadCoop = async () => {
      const coopId = await getUserCoopId()
      if (!coopId) throw new Error("Unauthorized")

      const { data, error } = await supabase
        .from("cooperatives")
        .select("*")
        .eq("id", coopId)
        .single()

      if (error) {
        console.error(error)
      } else {
        setCoop(data)
      }

      setLoading(false)
    }

    loadCoop()
  }, [])

  const handleChange = (field: string, value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCoop((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!coop) return

    setSaving(true)

    const { error } = await supabase
      .from("cooperatives")
      .update({
        name: coop.name,
        email: coop.email,
      })
      .eq("id", coop.id)

    if (error) {
      alert("Failed to save settings")
      console.error(error)
    } else {
      alert("Settings updated successfully!")
    }

    setSaving(false)
  }

  const today = new Date()

  const trialEnds = coop?.trial_ends_at
    ? new Date(coop.trial_ends_at)
    : null

  const subscriptionEnds = coop?.subscription_ends_at
    ? new Date(coop.subscription_ends_at)
    : null

  const subscriptionRemainingDays = subscriptionEnds
    ? Math.max(0, Math.ceil((subscriptionEnds.getTime() - today.getTime()) / 86400000))
    : null
  
  const isActive = coop?.subscription_status === "active"

  const remainingDays = trialEnds
    ? Math.max(
        0,
        Math.ceil((trialEnds.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      )
    : null

  const isTrialActive =
    coop?.subscription_status === "trial" && remainingDays !== null && remainingDays > 0

  const isTrialExpiringSoon =
    isTrialActive && remainingDays <= 3   // change threshold if needed

  const isExpired =
  coop?.subscription_status === "trial" && remainingDays === 0

  if (loading) return <p className="p-6">Loading settings...</p>
  if (!coop) return <p className="p-6 text-red-500">Cooperative not found</p>

  return (
    <div className="p-6 space-y-6 max-w-3xl">

      <Card>
        <CardHeader>
          <CardTitle>Cooperative Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Editable Fields */}
          <div>
            <Label className="pb-2">Cooperative Name</Label>
            <Input
              value={coop.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <Label className="pb-2">Email</Label>
            <Input
              value={coop.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>

        </CardContent>
      </Card>

      {/* Subscription Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">

          <div className="flex items-center justify-between">
            <span>Status</span>
            <Badge
              variant={
                isExpired
                  ? "destructive"
                  : isTrialExpiringSoon
                  ? "secondary"
                  : coop.subscription_status === "active"
                  ? "default"
                  : "outline"
              }
            >
              {isExpired ? "EXPIRED" : coop.subscription_status?.toUpperCase()}
            </Badge>
          </div>          

          {isTrialActive && coop?.trial_ends_at && (
            <div className="flex justify-between">
              <span>Trial Ends</span>
              <span>
                {new Date(coop?.trial_ends_at).toLocaleDateString()} | <span>{remainingDays} day{remainingDays === 1 ? "" : "s"} Remaining</span>
              </span>
            </div>
          )}

          {isActive && subscriptionRemainingDays !== null && (
            <div className="flex justify-between">
              <span>Billing Cycle Ends In</span>
              <span>
                {subscriptionRemainingDays} day
                {subscriptionRemainingDays === 1 ? "" : "s"}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Created At</span>
            <span>
              {new Date(coop.created_at).toLocaleDateString()}
            </span>
          </div>

          {isTrialExpiringSoon && (
            <p className="text-sm text-yellow-600">
              Your trial is about to expire. Subscribe to avoid interruption.
            </p>
          )}

          {isExpired && (
            <p className="text-sm text-red-600">
              Your trial has expired. Please subscribe to continue using the system.
            </p>
          )}

          {(isTrialExpiringSoon || isExpired) && (
            <Button className="w-full mt-4">
              Subscribe Now
            </Button>
          )}

        </CardContent>
      </Card>

    </div>
  )
}