"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/src/lib/supabase"
import { updateMember } from "@/src/services/memberService"

export default function EditMemberPage() {
  const { id } = useParams()
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [contact, setContact] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMember = async () => {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .single()

      if (data) {
        setFullName(data.full_name)
        setContact(data.contact_number)
        setAddress(data.address)
      }

      setLoading(false)
    }

    loadMember()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    await updateMember(id as string, fullName, contact, address)

    router.push("/members")
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold mb-6">Edit Member</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  )
}