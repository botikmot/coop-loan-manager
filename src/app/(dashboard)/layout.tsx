"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/src/lib/supabase"
import { getUserCoopName } from "@/src/lib/auth"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  LayoutDashboard,
  Users,
  Landmark,
  Settings,
  LogOut,
  NotebookText
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [coopName, setCoopName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const coop = await getUserCoopName()
      setCoopName(coop || "")
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="flex min-h-screen bg-muted/40">
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white">
        <div className="p-6">
          <h2 className="text-xl font-bold">{coopName}</h2>
          <p className="text-sm text-muted-foreground">
            Loan Management System
          </p>
        </div>

        <Separator />

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant={pathname === "/members" ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => router.push("/members")}
          >
            <Users className="mr-2 h-4 w-4" />
            Members
          </Button>

          <Button
            variant={pathname === "/loans" ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => router.push("/loans")}
          >
            <Landmark className="mr-2 h-4 w-4" />
            Loans
          </Button>

          <Button
            variant={pathname === "/reports" ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => router.push("/reports")}
          >
            <NotebookText className="mr-2 h-4 w-4" />
            Reports
          </Button>

          <Button
            variant={pathname === "/settings" ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => router.push("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>

        <div className="p-4">
          <Button
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}