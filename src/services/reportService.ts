import { supabase } from "@/src/lib/supabase"

export const getReportsSummary = async (coopId: string) => {
  // Fetch loans
  const { data: loans, error: loanError } = await supabase
    .from("loans")
    .select("*")
    .eq("coop_id", coopId)

  if (loanError) throw loanError

  // Fetch payments
  const { data: payments, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("coop_id", coopId)

  if (paymentError) throw paymentError

  const totalLoans = loans?.length || 0

  const activeLoans =
    loans?.filter((l) => l.status === "active").length || 0

  const completedLoans =
    loans?.filter((l) => l.status === "completed").length || 0

  const totalReleased =
    loans?.reduce(
      (sum, l) => sum + Number(l.principal_amount),
      0
    ) || 0

  const totalOutstanding =
    loans?.reduce(
      (sum, l) => sum + Number(l.remaining_balance),
      0
    ) || 0

  const totalCollected =
    payments?.reduce(
      (sum, p) => sum + Number(p.amount_paid),
      0
    ) || 0

  const today = new Date().toISOString().split("T")[0]

  const collectedToday =
    payments
      ?.filter((p) => p.payment_date === today)
      .reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0

  return {
    totalLoans,
    activeLoans,
    completedLoans,
    totalReleased,
    totalOutstanding,
    totalCollected,
    collectedToday,
  }
}