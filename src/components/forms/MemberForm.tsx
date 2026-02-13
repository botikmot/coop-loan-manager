"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Member } from "@/src/types/member"

interface Props {
  initialData?: Partial<Member>
  onSubmit: (data: Partial<Member>) => Promise<void>
}

export default function MemberForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState({
    name: initialData?.full_name || "",
    address: initialData?.address || "",
    contact_number: initialData?.contact_number || "",
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
        <Label className="pb-2">Full Name</Label>
        <Input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div>
        <Label className="pb-2">Address</Label>
        <Input
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
      </div>

      <div>
        <Label className="pb-2">Contact Number</Label>
        <Input
          value={form.contact_number}
          onChange={(e) =>
            handleChange("contact_number", e.target.value)
          }
        />
      </div>

      <Button type="submit">Save Member</Button>
    </form>
  )
}