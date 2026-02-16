"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useParams } from "next/navigation"
import { getLoanById, getPaymentsByLoanId } from "@/src/services/loanService"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/src/utils/formatCurrency"
import PaymentModal from "@/src/components/ui/PaymentModal"
import { useRouter } from "next/navigation"
import { useReactToPrint } from "react-to-print"
import { getUserCoopName } from "@/src/lib/auth"
import { formatDate } from "@/src/utils/formatDate"

export default function LoanDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const printRef = useRef(null)
  const rawLoanId = params.id
  const loanId = Array.isArray(rawLoanId) ? rawLoanId[0] : rawLoanId

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loan, setLoan] = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentLoanId, setPaymentLoanId] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [coopName, setCoopName] = useState("")

  const loadData = async () => {
      if (!loanId) return

      try {
        // Fetch loan
        const loanData = await getLoanById(loanId)
        setLoan(loanData)

        // Fetch payments (sorted ascending)
        const paymentData = await getPaymentsByLoanId(loanId)
        setPayments(paymentData)

        if (loanData && paymentData) {
          const totalPaid = paymentData.reduce(
            (sum, p) => sum + Number(p.amount_paid),
            0
          )

          if (totalPaid >= loanData.total_payable && loanData.status !== "completed") {
            loanData.status = "completed"
          }
        }


      } catch (error) {
        console.error(error)
        alert("Failed to load loan data")
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    
    loadData()

    const loadCoop = async () => {
      const name = await getUserCoopName()
      setCoopName(name || "")
    }

    loadCoop()

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!loanId) return

    setPaymentLoanId(loanId)
    setShowPaymentModal(true)
  }

  console.log('loan::',loan)
  const handlePrintSummary = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Loan-Summary-${loan?.memberName}`,
  })

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount_paid), 0)

  const remainingBalance = loan?.total_payable - totalPaid

  if (loading) return <p className="p-6">Loading...</p>
  if (!loan) return <p className="p-6 text-red-500">Loan not found</p>

  return (
    <div className="p-6">

      {/* Action Buttons */}
      <div className="flex justify-between px-6 no-print">
        <div className="flex space-x-2">
          <Button
              className="cursor-pointer"
              onClick={handleRecordPayment}
              disabled={loan.status === "completed"}
            >
              Record Payment
          </Button>
          <Button className="cursor-pointer" variant="outline" onClick={handlePrintSummary}>
            Print Loan Summary
          </Button>
        </div>

        <Button className="cursor-pointer" variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      <div className="space-y-6 p-6" ref={printRef}>
        {/* Loan Summary Card */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>{coopName || "Cooperative"}</CardTitle>
              <CardDescription>Loan Statement & Payment Summary</CardDescription>
            </div>
            <Badge variant={loan.status === "active" ? "secondary" : "success"}>
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

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-lg font-semibold">
                {formatCurrency(totalPaid)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Remaining Balance</p>
              <p className="text-lg font-semibold">
                {formatCurrency(remainingBalance)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Loan Status</p>
              <p className="text-lg font-semibold capitalize">
                {remainingBalance <= 0 ? "Completed" : loan.status}
              </p>
            </div>
          </CardContent>
        </Card>
      

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
                      <TableCell>{formatDate(p.payment_date)}</TableCell>
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

      <PaymentModal
        open={showPaymentModal}
        loanId={paymentLoanId}
        onClose={() => setShowPaymentModal(false)}
        onSaved={loadData}
      />

      <style global jsx>{`
        @media print {

          /* hide buttons & interactive UI */
          button,
          .no-print {
            display: none !important;
          }

          /* remove shadows & background for clean paper */
          body {
            background: white !important;
          }

          .shadow,
          .shadow-sm,
          .shadow-md,
          .shadow-lg {
            box-shadow: none !important;
          }

          /* improve spacing for print */
          /* .p-6 {
            padding: 0 !important;
          } */

          table {
            font-size: 12px;
            border-collapse: collapse;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 6px;
          }
        }
      `}</style>

    </div>
  )
}