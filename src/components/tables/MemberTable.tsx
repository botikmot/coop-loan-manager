"use client"

import { Member } from "@/src/types/member"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/Table"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import ConfirmationModal from "@/src/components/ui/ConfirmationModal"

interface Props {
  members: Member[]
  onEdit: (member: Member) => void
  onDelete?: (id: string) => void
}

export default function MemberTable({ members, onEdit, onDelete }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [nameToDelete, setNameToDelete] = useState<string | null>(null)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const dataToBeDeleted = (id: string, name: string) => {
    setDeleteId(id)
    setNameToDelete(name)
  }

  return (
    <div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {members.map((m) => (
          <TableRow key={m.id}>
            <TableCell>{m.full_name}</TableCell>
            <TableCell>{m.contact_number}</TableCell>
            <TableCell>{m.address}</TableCell>
            <TableCell className="">
              <TooltipProvider>
                {/* EDIT */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => onEdit(m)}
                      className="p-2 rounded cursor-pointer hover:bg-gray-100 text-blue-600"
                    >
                      <Pencil size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Member</TooltipContent>
                </Tooltip>

                {/* DELETE */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => dataToBeDeleted(m.id, m.full_name)}
                      className="p-2 rounded cursor-pointer hover:bg-gray-100 text-red-600"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Member</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <ConfirmationModal
        open={!!deleteId}
        title="Delete Member"
        message={`This member "${nameToDelete}" will be permanently removed.`}
        confirmText="Delete"
        loading={loadingDelete}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return
          setLoadingDelete(true)

          await onDelete?.(deleteId)

          setLoadingDelete(false)
          setDeleteId(null)
        }}
      />
    </div>
  )
}