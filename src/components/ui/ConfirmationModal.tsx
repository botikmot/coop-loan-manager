"use client"

import Modal from "@/src/components/ui/Modal"
import { Button } from "@/components/ui/button"

interface Props {
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onClose: () => void
}

export default function ConfirmationModal({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-6 text-gray-600">{message}</p>

      <div className="flex justify-end gap-3">
        <Button className="cursor-pointer" variant="outline" onClick={onClose}>
          {cancelText}
        </Button>

        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </div>
    </Modal>
  )
}