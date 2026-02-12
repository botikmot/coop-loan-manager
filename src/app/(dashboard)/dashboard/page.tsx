"use client"

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/src/services/dashboardService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    memberCount: 0,
    activeLoans: 0,
    totalReleased: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      const data = await getDashboardStats()
      setStats(data)
    }

    loadStats()
  }, [])

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your cooperative
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.memberCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.activeLoans}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Loan Released</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ₱ {stats.totalReleased.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}