"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/src/lib/supabase"
import { getMembers, deleteMember, createMember, updateMember } from "@/src/services/memberService"
import MemberTable from "@/src/components/tables/MemberTable"
import MemberForm from "@/src/components/forms/MemberForm"
import Modal from "@/src/components/ui/Modal"
import { Button } from "@/components/ui/button"
import { Member } from "@/src/types/member"

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  const [openModal, setOpenModal] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  const loadMembers = async () => {
    const data = await getMembers()
    if (data) setMembers(data)
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await loadMembers()
      setLoading(false)
    }

    init()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteMember(id)
    await loadMembers()
  }

  const openAddModal = () => {
    setEditingMember(null)
    setOpenModal(true)
  }

  const openEditModal = (member: Member) => {
    setEditingMember(member)
    setOpenModal(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    if (editingMember) {
      await updateMember(editingMember.id, data)
    } else {
      await createMember(
        data.name,
        data.contact_number,
        data.address
      )
    }

    setOpenModal(false)
    await loadMembers()
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Members</h1>

        <Button className="cursor-pointer hover:bg-gray-500" onClick={openAddModal}>
          + Add Member
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <MemberTable
          members={members}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={editingMember ? "Edit Member" : "Add Member"}
      >
        <MemberForm
          initialData={editingMember || undefined}
          onSubmit={handleSubmit}
        />
      </Modal>

    </div>
  )
}