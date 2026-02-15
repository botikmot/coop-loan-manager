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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMemo } from "react"

interface LoanTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loans: any[]
  search: string
  onSearch: (value: string) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onAddPayment?: (loanId: string) => void
}

export default function LoanTable({ loans, search, onSearch, page, totalPages, onPageChange, onAddPayment }: LoanTableProps) {
  
  const pageSize = 10

  //Filter loans by member name
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) =>
      loan.members?.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [loans, search])

  const paginatedLoans = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredLoans.slice(start, start + pageSize)
  }, [filteredLoans, page])


  return (
    <TooltipProvider>

      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search member..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-sm"
        />

        <p className="text-sm text-muted-foreground">
          {filteredLoans.length} result(s)
        </p>
      </div>

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
          <TableHead className="font-bold">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
          {paginatedLoans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.members?.full_name}</TableCell>
              <TableCell>{formatCurrency(loan.principal_amount)}</TableCell>
              <TableCell>{loan.interest_rate}%</TableCell>
              <TableCell>{loan.term_months} mo</TableCell>
              <TableCell>{formatCurrency(loan.total_payable)}</TableCell>
              <TableCell>{formatCurrency(loan.monthly_payment)}</TableCell>
              <TableCell className={`${loan.status === 'completed' ? 'text-green-500 capitalize' : 'capitalize'}`}>
                {loan.status}
              </TableCell>
              <TableCell>{formatCurrency(loan.remaining_balance)}</TableCell>
              <TableCell>
                <div className="flex gap-2">

                  {/* Record Payment */}
                  {loan.status !== "completed" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => onAddPayment?.(loan.id)}
                          className="p-2 hover:bg-muted text-blue-600"
                        >
                          <PlusCircle size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Record Payment
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Summary */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/loans/${loan.id}`}
                        className="p-2 hover:bg-muted text-gray-700 rounded-md"
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

       {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            className="cursor-pointer"
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </Button>

          <span className="px-2 py-1 text-sm">
            Page {page} of {totalPages}
          </span>

          <Button
            className="cursor-pointer"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

    </TooltipProvider>
  )
}