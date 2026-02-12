"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/src/lib/supabase"
import Link from "next/link"
import { getMembers } from "@/src/services/memberService"
import { deleteMember } from "@/src/services/memberService"

type Member = {
  id: string
  full_name: string
  contact_number: string
  address: string
}

export default function MembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMembers = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push("/auth/login")

      const data = await getMembers()

      if (data) setMembers(data)
      setLoading(false)
    }

    loadMembers()
  }, [router])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Members</h1>
        <Link
          href="/members/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Member
        </Link>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t">
                <td className="p-3">{member.full_name}</td>
                <td className="p-3">{member.contact_number}</td>
                <td className="p-3">{member.address}</td>
                <td className="p-3">
                  <Link
                    href={`/members/${member.id}/edit`}
                    className="text-blue-600 underline"
                  >
                    Edit
                  </Link>
                  <button
                        onClick={async () => {
                            if (confirm("Delete this member?")) {
                            await deleteMember(member.id)
                            const updated = await getMembers()
                            setMembers(updated)
                            }
                        }}
                        className="text-red-600 ml-4"
                        >
                        Delete
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}