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
    amount,
    payment_date: new Date(),
  })

  if (error) throw error
}