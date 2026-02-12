"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/src/lib/supabase"

export default function RegisterPage() {
  const router = useRouter()

  const [coopName, setCoopName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create Auth User
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) throw signUpError
      if (!data.user) throw new Error("User creation failed")

      const userId = data.user.id

      // Create Cooperative
      const { data: coop, error: coopError } = await supabase
        .from("cooperatives")
        .insert({
          name: coopName,
          email,
        })
        .select()
        .single()

      if (coopError) throw coopError

      // Link User to Cooperative
      const { error: userError } = await supabase.from("users").insert({
        id: userId,
        coop_id: coop.id,
        role: "admin",
      })

      if (userError) throw userError

      router.push("/dashboard")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Register Cooperative
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Cooperative Name</label>
            <input
              type="text"
              required
              className="w-full border p-2 rounded"
              value={coopName}
              onChange={(e) => setCoopName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Admin Email</label>
            <input
              type="email"
              required
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-600 underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  )
}