"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getLoans } from "@/src/services/loanService"
import LoanTable from "@/src/components/tables/LoanTable"
import AddLoanModal from "@/src/components/ui/AddLoanModal"

export default function LoansPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Define fetchLoans in component scope
  const fetchLoans = async () => {
    const data = await getLoans()
    setLoans(data)
  }

  // UseEffect wrapper pattern
  useEffect(() => {
    const fetchData = async () => {
      await fetchLoans()
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Loans</h1>
        <Button onClick={() => setShowModal(true)}>+ Add Loan</Button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <LoanTable loans={loans} />
      </div>

      <AddLoanModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSaved={fetchLoans} // can reuse the same fetchLoans
      />
    </div>
  )
}