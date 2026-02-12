"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createLoan } from "@/src/services/loanService"
import { getMembers } from "@/src/services/memberService"

export default function AddLoanPage() {
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [members, setMembers] = useState<any[]>([])
  const [memberId, setMemberId] = useState("")
  const [principal, setPrincipal] = useState("")
  const [interest, setInterest] = useState("")
  const [term, setTerm] = useState("")

  useEffect(() => {
    const loadMembers = async () => {
      const data = await getMembers()
      setMembers(data)
    }
    loadMembers()
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await createLoan(
      memberId,
      Number(principal),
      Number(interest),
      Number(term)
    )

    router.push("/loans")
  }

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold mb-6">Add Loan</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full border p-2 rounded"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
        >
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name}
            </option>
          ))}
        </select>

        <input
          placeholder="Principal"
          type="number"
          className="w-full border p-2 rounded"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />

        <input
          placeholder="Interest %"
          type="number"
          className="w-full border p-2 rounded"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          required
        />

        <input
          placeholder="Term"
          type="number"
          className="w-full border p-2 rounded"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  )
}