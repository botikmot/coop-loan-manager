import { supabase } from "@/src/lib/supabase"
import { getUserCoopId } from "@/src/lib/auth"

export const getMembers = async () => {
  const coopId = await getUserCoopId()
  if (!coopId) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("coop_id", coopId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

export const createMember = async (
  full_name: string,
  contact_number: string,
  address: string
) => {
  const coopId = await getUserCoopId()
  if (!coopId) throw new Error("Unauthorized")

  if (!full_name.trim()) {
    throw new Error("Full name is required")
  }

  const { error } = await supabase.from("members").insert({
    coop_id: coopId,
    full_name,
    contact_number,
    address,
  })

  if (error) throw error
}

export const updateMember = async (
  id: string,
  full_name: string,
  contact_number: string,
  address: string
) => {
  if (!full_name.trim()) {
    throw new Error("Full name is required")
  }

  const { error } = await supabase
    .from("members")
    .update({
      full_name,
      contact_number,
      address,
    })
    .eq("id", id)

  if (error) throw error
}

export const deleteMember = async (id: string) => {
  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id)

  if (error) throw error
}