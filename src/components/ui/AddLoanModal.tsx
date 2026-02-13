"use client"

import { useEffect, useState } from "react"
import Modal from "./Modal"
import { getMembers } from "@/src/services/memberService"
import { createLoan } from "@/src/services/loanService"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddLoanModal({ isOpen, onClose, onSaved }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [members, setMembers] = useState<any[]>([])
  const [memberId, setMemberId] = useState("")
  const [principal, setPrincipal] = useState("")
  const [interest, setInterest] = useState("")
  const [term, setTerm] = useState("")

  useEffect(() => {
    const load = async () => {
      const data = await getMembers()
      setMembers(data)
    }
    if (isOpen) load()
  }, [isOpen])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await createLoan(
      memberId,
      Number(principal),
      Number(interest),
      Number(term)
    )

    onSaved()
    onClose()
  }

  return (
    <Modal open={isOpen} onClose={onClose} title="Add Loan">
      <form onSubmit={handleSubmit} className="space-y-3">
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
          type="number"
          placeholder="Principal"
          className="w-full border p-2 rounded"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Interest %"
          className="w-full border p-2 rounded"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Term (months)"
          className="w-full border p-2 rounded"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          required
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Save Loan
        </button>
      </form>
    </Modal>
  )
}