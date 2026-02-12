import { supabase } from "@/src/lib/supabase"
import { getUserCoopId } from "@/src/lib/auth"

export const getDashboardStats = async () => {
  const coopId = await getUserCoopId()
  if (!coopId) throw new Error("Unauthorized")

  const { count: memberCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("coop_id", coopId)

  const { count: activeLoans } = await supabase
    .from("loans")
    .select("*", { count: "exact", head: true })
    .eq("coop_id", coopId)
    .eq("status", "active")

  const { data: totalReleased } = await supabase
    .from("loans")
    .select("total_amount")
    .eq("coop_id", coopId)

  const total = totalReleased?.reduce(
    (sum, loan) => sum + Number(loan.total_amount),
    0
  )

  return {
    memberCount: memberCount ?? 0,
    activeLoans: activeLoans ?? 0,
    totalReleased: total ?? 0,
  }
}