"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/src/lib/supabase"
import { getDashboardStats } from "@/src/services/dashboardService"
import { getUserCoopName } from "@/src/lib/auth"

export default function DashboardPage() {
  const router = useRouter()  
  const [loading, setLoading] = useState(true)
  const [coopName, setCoopName] = useState("")

  const [stats, setStats] = useState({
    memberCount: 0,
    activeLoans: 0,
    totalReleased: 0,
  })

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const coopName = await getUserCoopName()
      setCoopName(coopName)

      // Get dashboard stats
      const dashboardStats = await getDashboardStats()
      setStats(dashboardStats)

      setLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {coopName} Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Total Members</h2>
          <p className="text-2xl mt-2 font-bold">
            {stats.memberCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Active Loans</h2>
          <p className="text-2xl mt-2 font-bold">
            {stats.activeLoans}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">
            Total Loan Released
          </h2>
          <p className="text-2xl mt-2 font-bold">
            ₱ {stats.totalReleased.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}