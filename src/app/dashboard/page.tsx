"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/src/lib/supabase"

export default function DashboardPage() {
  const router = useRouter()
  const [coopName, setCoopName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get coop_id from users table
      const { data: userData } = await supabase
        .from("users")
        .select("coop_id")
        .eq("id", user.id)
        .single()

      if (userData) {
        const { data: coop } = await supabase
          .from("cooperatives")
          .select("name")
          .eq("id", userData.coop_id)
          .single()

        if (coop) {
          setCoopName(coop.name)
        }
      }

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

      {/* Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Total Members</h2>
          <p className="text-2xl mt-2 font-bold">0</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Active Loans</h2>
          <p className="text-2xl mt-2 font-bold">0</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Total Loan Released</h2>
          <p className="text-2xl mt-2 font-bold">₱ 0.00</p>
        </div>
      </div>
    </div>
  )
}