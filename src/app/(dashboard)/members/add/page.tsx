"use client"

import { useRouter } from "next/navigation"
import { createMember } from "@/src/services/memberService"
import MemberForm from "@/src/components/forms/MemberForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AddMemberPage() {
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    await createMember(
      data.name,
      data.contact_number,
      data.address
    )

    router.push("/members")
  }

  return (
    <div className="p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Add Member</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  )
}