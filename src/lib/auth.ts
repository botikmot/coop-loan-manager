import { supabase } from "@/src/lib/supabase"

export const getUserCoopId = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from("users")
    .select("coop_id")
    .eq("id", user.id)
    .single()

  return data?.coop_id ?? null
}

export const getUserCoopName = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get coop_id
  const { data: userData } = await supabase
    .from("users")
    .select("coop_id")
    .eq("id", user.id)
    .single()

  if (!userData?.coop_id) return null

  // Get coop name
  const { data: coop } = await supabase
    .from("cooperatives")
    .select("name")
    .eq("id", userData.coop_id)
    .single()

  return coop?.name ?? null
}

export const getUserRole = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  return data?.role ?? null
}