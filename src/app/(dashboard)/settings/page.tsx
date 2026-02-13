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
            <Label>Cooperative Name</Label>
            <Input
              value={coop.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
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
            <Badge variant={coop.subscription_status === "active" ? "default" : "secondary"}>
              {coop.subscription_status?.toUpperCase()}
            </Badge>
          </div>

          {coop.trial_ends_at && (
            <div className="flex justify-between">
              <span>Trial Ends</span>
              <span>
                {new Date(coop.trial_ends_at).toLocaleDateString()}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Created At</span>
            <span>
              {new Date(coop.created_at).toLocaleDateString()}
            </span>
          </div>

        </CardContent>
      </Card>

    </div>
  )
}