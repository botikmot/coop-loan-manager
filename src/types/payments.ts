export interface Payment {
  id: string
  loan_id: string
  coop_id: string
  amount_paid: number
  payment_date: string
  created_at?: string
}