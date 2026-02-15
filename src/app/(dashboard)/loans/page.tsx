"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getLoans } from "@/src/services/loanService"
import LoanTable from "@/src/components/tables/LoanTable"
import AddLoanModal from "@/src/components/ui/AddLoanModal"
import PaymentModal from "@/src/components/ui/PaymentModal"
import { useDebounce } from "@/src/utils/useDebounce"

export default function LoansPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loans, setLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [paymentLoanId, setPaymentLoanId] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search)

  // Define fetchLoans in component scope
  const fetchLoans = async () => {
    const res = await getLoans({ page, limit: pageSize, search: debouncedSearch })
    setLoans(res.loans)
    setTotal(res.total)
    setLoading(false)
  }

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      const res = await getLoans({ page, limit: pageSize, search: debouncedSearch })

      if (!isMounted) return

      setLoans(res.loans)
      setTotal(res.total ?? 0)
      setLoading(false)
    }

    load()

    return () => {
      isMounted = false
    }
  }, [page, debouncedSearch])

  const totalPages = Math.ceil(total / pageSize)

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Loans</h1>
        <Button className="cursor-pointer hover:bg-gray-600" onClick={() => setShowModal(true)}>+ Add Loan</Button>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <LoanTable
         loans={loans}
         search={search}
         onSearch={setSearch}
         page={page}
         totalPages={totalPages}
         onPageChange={setPage}
         onAddPayment={(loanId) => {
            setPaymentLoanId(loanId)
            setShowPaymentModal(true)
          }}
        />
      </div>

      <AddLoanModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSaved={fetchLoans} // can reuse the same fetchLoans
      />

      <PaymentModal
        open={showPaymentModal}
        loanId={paymentLoanId}
        onClose={() => setShowPaymentModal(false)}
        onSaved={fetchLoans}
      />
    </div>
  )
}