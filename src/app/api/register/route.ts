import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { email, password, coopName } = await req.json()

  try {
    // 1️⃣ Create Auth user
    const { data, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    })

    if (signUpError) throw signUpError
    if (!data?.user) throw new Error("Failed to create auth user")

    const authUser = data.user  // ✅ now authUser is type User

    // 2️⃣ Create Cooperative
    const { data: coop, error: coopError } = await supabaseAdmin
      .from("cooperatives")
      .insert({ name: coopName, email })
      .select()
      .single()
    if (coopError) throw coopError

    // 3️⃣ Create user record linked to coop
    const { error: userError } = await supabaseAdmin
      .from("users")
      .insert({
        id: authUser.id,
        coop_id: coop.id,
        role: "admin",
      })
    if (userError) throw userError

    return NextResponse.json({ user: authUser, coop })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}