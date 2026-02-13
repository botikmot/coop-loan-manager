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

interface Props {
  members: Member[]
  onEdit: (member: Member) => void
  onDelete?: (id: string) => void
}

export default function MemberTable({ members, onEdit, onDelete }: Props) {
  return (
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
            <TableCell className="space-x-4">
              <button
                onClick={() => onEdit(m)}
                className="text-blue-600 cursor-pointer"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete?.(m.id)}
                className="text-red-600 cursor-pointer"
              >
                Delete
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}