"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<void>
}

export default function LoanForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    principal_amount: "",
    interest_rate: "",
    term_months: "",
  })

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
    >
      <div>
        <Label>Principal Amount</Label>
        <Input
          type="number"
          value={form.principal_amount}
          onChange={(e) =>
            handleChange("principal_amount", e.target.value)
          }
        />
      </div>

      <div>
        <Label>Interest Rate (%)</Label>
        <Input
          type="number"
          value={form.interest_rate}
          onChange={(e) =>
            handleChange("interest_rate", e.target.value)
          }
        />
      </div>

      <div>
        <Label>Term (months)</Label>
        <Input
          type="number"
          value={form.term_months}
          onChange={(e) =>
            handleChange("term_months", e.target.value)
          }
        />
      </div>

      <Button type="submit">Save Loan</Button>
    </form>
  )
}