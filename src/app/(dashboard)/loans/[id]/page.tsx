"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { getLoanById, getPaymentsByLoanId } from "@/src/services/loanService"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/src/utils/formatCurrency"

export default function LoanDetailsPage() {
  const params = useParams()
  const rawLoanId = params.id
  const loanId = Array.isArray(rawLoanId) ? rawLoanId[0] : rawLoanId

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loan, setLoan] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loanId) return

    const loadData = async () => {
      try {
        // Fetch loan
        const loanData = await getLoanById(loanId)
        setLoan(loanData)

        // Fetch payments (sorted ascending)
        const paymentData = await getPaymentsByLoanId(loanId)
        setPayments(paymentData)
      } catch (error) {
        console.error(error)
        alert("Failed to load loan data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [loanId])

  // Compute running balance safely
  const paymentsWithBalance = useMemo(() => {
    if (!loan) return []

    let balance = loan.total_payable
    return payments.map((p) => {
      const newBalance = balance - Number(p.amount_paid)
      balance = newBalance
      return { ...p, balance: newBalance }
    })
  }, [payments, loan])

  const handleRecordPayment = () => {
    alert("Open Record Payment modal or navigate to Record Payment page")
  }

  const handlePrintSummary = () => {
    alert("Trigger Print / PDF download")
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (!loan) return <p className="p-6 text-red-500">Loan not found</p>

  return (
    <div className="space-y-6 p-6">

      {/* Loan Summary Card */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Loan Summary</CardTitle>
          <Badge variant={loan.status === "active" ? "secondary" : "default"}>
            {loan.status.toUpperCase()}
          </Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Member:</strong> {loan.memberName}</p>
            <p><strong>Principal Amount:</strong> {formatCurrency(loan.principal_amount)}</p>
            <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>
            <p><strong>Interest Amount:</strong> {formatCurrency(loan.interest_amount)}</p>
          </div>
          <div>
            <p><strong>Total Payable:</strong> {formatCurrency(loan.total_payable)}</p>
            <p><strong>Monthly Payment:</strong> {formatCurrency(loan.monthly_payment)}</p>
            <p><strong>Term:</strong> {loan.term_months} months</p>
            <p><strong>Date Issued:</strong> {new Date(loan.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button variant="default" onClick={handleRecordPayment}>
          Record Payment
        </Button>
        <Button variant="outline" onClick={handlePrintSummary}>
          Print Loan Summary
        </Button>
      </div>

      {/* Payment History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentsWithBalance.length === 0 ? (
            <p>No payments recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentsWithBalance.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{new Date(p.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(p.amount_paid)}</TableCell>
                    <TableCell>{formatCurrency(p.balance)}</TableCell>
                    <TableCell>{p.method || "Cash"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  )
}