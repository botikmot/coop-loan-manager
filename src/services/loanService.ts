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

export const getLoanById = async (loanId: string) => {
  const { data: loan, error: loanError } = await supabase
    .from("loans")
    .select("*")
    .eq("id", loanId)
    .single()

  if (loanError) throw loanError

  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("full_name")
    .eq("id", loan.member_id)
    .single()

  if (memberError) throw memberError

  return {
    ...loan,
    memberName: member.full_name
  }
}

export const getPaymentsByLoanId = async (loanId: string) => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("loan_id", loanId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return data || []
}