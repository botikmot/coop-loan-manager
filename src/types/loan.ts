export interface Loan {
  id: string
  coop_id: string
  member_id: string
  principal_amount: number
  interest_rate: number
  interest_amount: number
  total_payable: number
  monthly_payment: number
  remaining_balance: number
  term_months: number
  status: "active" | "completed"
  created_at?: string
}