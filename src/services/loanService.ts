import { supabase } from "@/src/lib/supabase"
import { getUserCoopId } from "@/src/lib/auth"
import { calculateLoan } from "../lib/loanCalculator"

interface GetLoansParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDir?: "asc" | "desc"
}

export async function getLoans({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "created_at",
  sortDir = "desc",
}: GetLoansParams) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Base query: loans + members
  let query = supabase
    .from("loans")
    .select(`
      id,
      principal_amount,
      interest_rate,
      term_months,
      total_payable,
      monthly_payment,
      remaining_balance,
      status,
      created_at,
      members(id, full_name)
    `, { count: "exact" })
    .range(from, to)
    .order(sortBy, { ascending: sortDir === "asc" })

  // Filter by member full_name if search exists
  if (search) {
    // Use filter with ilike on the foreign table
    query = query.filter("members.full_name", "ilike", `%${search}%`)
  }

  const { data, count, error } = await query

  if (error) throw error

  return {
    loans: data ?? [],
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
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