import { supabase } from "@/src/lib/supabase"
import { getUserCoopId } from "@/src/lib/auth"

export const createPayment = async (
  loan_id: string,
  amount: number
) => {
  const coopId = await getUserCoopId()
  if (!coopId) throw new Error("Unauthorized")

  const { error } = await supabase.from("payments").insert({
    coop_id: coopId,
    loan_id,
    amount_paid: amount,
    payment_date: new Date(),
  })

  const { data: loan } = await supabase.from('loans').select('*').eq('id', loan_id).single();
  const newBalance = loan.remaining_balance - amount;
  await supabase.from('loans').update({ remaining_balance: newBalance, status: newBalance <= 0 ? 'completed' : 'active' }).eq('id', loan_id);

  if (error) throw error
}