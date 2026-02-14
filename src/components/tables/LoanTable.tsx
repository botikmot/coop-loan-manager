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
import { PlusCircle, FileText } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface LoanTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loans: any[]
  onAddPayment?: (loanId: string) => void
}

export default function LoanTable({ loans }: LoanTableProps) {
  return (
    <TooltipProvider>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold">Member</TableHead>
          <TableHead className="font-bold">Principal</TableHead>
          <TableHead className="font-bold">Interest %</TableHead>
          <TableHead className="font-bold">Term</TableHead>
          <TableHead className="font-bold">Total</TableHead>
          <TableHead className="font-bold">Monthly</TableHead>
          <TableHead className="font-bold">Status</TableHead>
          <TableHead className="font-bold">Balance</TableHead>
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
            <TableCell className={`${loan.status === 'completed' ? 'text-green-500 capitalize' : 'capitalize'}`}>{loan.status}</TableCell>
            <TableCell>{formatCurrency(loan.remaining_balance)}</TableCell>
            <TableCell>
              <div className="flex gap-2">

                {/* Record Payment */}
                {loan.status !== "completed" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/loans/${loan.id}/payment`}
                        className="p-2 rounded-md hover:bg-muted text-blue-600"
                      >
                        <PlusCircle size={18} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Record Payment
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Loan Summary */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/loans/${loan.id}`}
                      className="p-2 rounded-md hover:bg-muted text-gray-700"
                    >
                      <FileText size={18} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    View Summary
                  </TooltipContent>
                </Tooltip>

              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </TooltipProvider>
  )
}