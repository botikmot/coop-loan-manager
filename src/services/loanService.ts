import { supabase } from "@/src/lib/supabase"
import { getUserCoopId } from "@/src/lib/auth"
import { calculateLoan } from "../lib/loanCalculator"

export const getLoans = async () => {
  const coopId = await getUserCoopId()
  if (!coopId) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("loans")
    .select("*, members(full_name)")
    .eq("coop_id", coopId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

export const createLoan = async (
  member_id: string,
  principal: number,
  interest_rate: number,
  term: number
) => {
  const coopId = await getUserCoopId()
  if (!coopId) throw new Error("Unauthorized")

  const { interest, total, monthly } = calculateLoan(principal, interest_rate, term);

  //const total_amount = principal + (principal * interest_rate) / 100

  const { error } = await supabase.from("loans").insert({
    coop_id: coopId,
    member_id,
    principal_amount: principal,
    interest_rate,
    interest_amount: interest,
    term_months: term,
    total_payable: total,
    monthly_payment: monthly,
    remaining_balance: total,
  })

  if (error) throw error
}