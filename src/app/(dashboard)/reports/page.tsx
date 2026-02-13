"use client"

import { useEffect, useState } from "react"
import { getUserCoopId } from "@/src/lib/auth"
import { getReportsSummary } from "@/src/services/reportService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/src/utils/formatCurrency"

export default function ReportsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReports = async () => {
      try {
        const coopId = await getUserCoopId()
        if (!coopId) throw new Error("Unauthorized")

        const data = await getReportsSummary(coopId)
        setStats(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  if (loading) return <p className="p-6">Loading reports...</p>
  if (!stats) return <p className="p-6">No data available</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Total Loans Released</CardTitle>
          </CardHeader>
          <CardContent>
            {formatCurrency(stats.totalReleased)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            {formatCurrency(stats.totalOutstanding)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            {formatCurrency(stats.totalCollected)}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}