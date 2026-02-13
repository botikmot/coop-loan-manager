"use client"

import { formatCurrency } from "@/src/utils/formatCurrency"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/Table"
import Link from "next/link"

interface LoanTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loans: any[]
  onAddPayment?: (loanId: string) => void
}

export default function LoanTable({ loans }: LoanTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Principal</TableHead>
          <TableHead>Interest %</TableHead>
          <TableHead>Term</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Monthly</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Balance</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id}>
            <TableCell>{loan.members?.full_name}</TableCell>
            <TableCell>{formatCurrency(loan.principal_amount)}</TableCell>
            <TableCell>{loan.interest_rate}%</TableCell>
            <TableCell>{loan.term_months} mo</TableCell>
            <TableCell>{formatCurrency(loan.total_payable)}</TableCell>
            <TableCell>{formatCurrency(loan.monthly_payment)}</TableCell>
            <TableCell>{loan.status}</TableCell>
            <TableCell>{formatCurrency(loan.remaining_balance)}</TableCell>
            <TableCell className="space-x-4">
              <Link
                    href={`/loans/${loan.id}/payment`}
                    className="text-blue-600 underline"
                >
                    Add Payment
                </Link>

                <Link
                    href={`/loans/${loan.id}`}
                    className="text-blue-600 underline"
                    >
                    Summary
                </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}