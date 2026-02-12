"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createPayment } from "@/src/services/paymentService"

export default function PaymentPage() {
  const { id } = useParams()
  const router = useRouter()
  const [amount, setAmount] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault()

    await createPayment(id as string, Number(amount))
    router.push("/loans")
  }

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold mb-6">Record Payment</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Payment Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Save Payment
        </button>
      </form>
    </div>
  )
}