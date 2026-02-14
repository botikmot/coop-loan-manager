"use client"

import { useEffect, useState } from "react"
import Modal from "./Modal"
import { getMembers } from "@/src/services/memberService"
import { createLoan } from "@/src/services/loanService"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

type FormValues = {
  memberId: string
  principal: string
  interest: string
  term: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AddLoanModal({ isOpen, onClose, onSaved }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      memberId: "",
      principal: "",
      interest: "",
      term: "",
    },
  })

  useEffect(() => {
    const load = async () => {
      const data = await getMembers()
      setMembers(data)
    }
    if (isOpen) load()
  }, [isOpen])

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true)
      
      const principalNumber = Math.max(0, Number(values.principal.replace(/,/g, "")))

      const newLoan = await createLoan(
        values.memberId,
        principalNumber,
        Math.max(0, Number(values.interest)),
        Math.max(0, Number(values.term))
      )

      setSuccess(true)

      toast.success("Loan successfully created.")

      onSaved(newLoan)

      setTimeout(() => {
        onClose()
        form.reset()
        setSuccess(false)
      }, 900)

    } catch (error) {
      toast.error("Error", {
        description: "Failed to save loan.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose} title="Add Loan">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* Member Select */}
        <FormField
          control={form.control}
          name="memberId"
          rules={{ required: "Please select a member" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Member" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Principal */}
          <FormField
            control={form.control}
            name="principal"
            rules={{ required: "Principal is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Principal</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter amount"
                    value={field.value}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, "")
                      const numeric = raw.replace(/[^0-9.]/g, "")
                      const formatted = Number(numeric).toLocaleString()

                      field.onChange(formatted)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* Interest */}
          <FormField
            control={form.control}
            name="interest"
            rules={{ required: "Interest is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter interest" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {/* Term */}
          <FormField
            control={form.control}
            name="term"
            rules={{ required: "Term is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Term (months)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter months" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <Button type="submit" className="w-full" disabled={loading}>
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {loading ? "Saving..." : "Save Loan"}
        </Button>
      </form>
      </Form>
    </Modal>
  )
}