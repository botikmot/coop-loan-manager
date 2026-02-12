"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getLoans } from "@/src/services/loanService"
import { formatCurrency } from "@/src/utils/formatCurrency"

export default function LoansPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await getLoans()
      setLoans(data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Loans</h1>
        <Link
          href="/loans/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Loan
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Member</th>
            <th className="p-3 text-left">Principal</th>
            <th className="p-3 text-left">Interest %</th>
            <th className="p-3 text-left">Term</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Monthly</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Balance</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className="border-t">
              <td className="p-3">
                <Link
                  href={`/loans/${loan.id}`}
                  className="text-blue-600 underline"
                >
                 {loan.members?.full_name}
                </Link>
              </td>
              <td className="p-3">{formatCurrency(loan.principal_amount)}</td>
              <td className="p-3">{loan.interest_rate}%</td>
              <td className="p-3">{loan.term_months} months</td>
              <td className="p-3">{formatCurrency(loan.total_payable)}</td>
              <td className="p-3">{formatCurrency(loan.monthly_payment)}</td>
              <td className="p-3">{loan.status}</td>
              <td className="p-3">{formatCurrency(loan.remaining_balance)}</td>
              <td className="p-3">
                <Link
                  href={`/loans/${loan.id}/payment`}
                  className="text-blue-600 underline"
                >
                  Add Payment
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}