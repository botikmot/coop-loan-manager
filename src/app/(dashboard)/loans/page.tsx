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
  const [sortBy, setSortBy] = useState("created_at")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  // Define fetchLoans in component scope
  const fetchLoans = async () => {
    setLoading(true)
    try {
      const res = await getLoans({
        page,
        limit: pageSize,
        search: debouncedSearch,
        sortBy,
        sortDir,
      })
      setLoans(res.loans)
      setTotal(res.total)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      setLoading(true)

      const res = await getLoans({ page, limit: pageSize, search: debouncedSearch, sortBy, sortDir })

      if (!isMounted) return

      setLoans(res.loans)
      setTotal(res.total ?? 0)
      setLoading(false)
    }

    load()

    return () => {
      isMounted = false
    }
  }, [page, debouncedSearch, sortBy, sortDir])


  const totalPages = Math.ceil(total / pageSize)

  if (loading)
    return (
      <div className="p-6 space-y-3 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    )

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
         onSearch={(value) => {
            setSearch(value)
            setPage(1) // reset immediately when search changes
          }}
         page={page}
         totalPages={totalPages}
         setSortBy={setSortBy}
         sortDir={sortDir}
         setSortDir={setSortDir}
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