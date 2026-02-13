"use client"

import { useState } from "react"
import Modal from "./Modal"
import { createPayment } from "@/src/services/paymentService"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PaymentModal({ loanId, onClose, onSaved }: any) {
  const [amount, setAmount] = useState("")

  if (!loanId) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await createPayment(loanId, Number(amount))

    onSaved()
    onClose()
  }

  return (
    <Modal open={!!loanId} onClose={onClose} title="Record Payment">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="number"
          placeholder="Payment Amount"
          className="w-full border p-2 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Save Payment
        </button>
      </form>
    </Modal>
  )
}