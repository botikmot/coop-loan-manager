"use client"

import { useState } from "react"
import Modal from "@/src/components/ui/Modal"
import { createPayment } from "@/src/services/paymentService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
  loanId: string | null
  onSaved: () => void
}

export default function PaymentModal({
  open,
  onClose,
  loanId,
  onSaved,
}: Props) {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!loanId) return

    try {
      setLoading(true)

      await createPayment(loanId, Number(amount))

      toast.success("Payment recorded")

      onSaved()
      onClose()
      setAmount("")
    } catch {
      toast.error("Failed to record payment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Record Payment">
      <div className="space-y-4">
        <Input
          type="number"
          placeholder="Payment amount"
          value={amount}
          min={0}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Button
          onClick={handleSave}
          disabled={loading || !amount}
          className="w-full cursor-pointer"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Saving..." : "Save Payment"}
        </Button>
      </div>
    </Modal>
  )
}