"use client"

import { ReactNode } from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({
  open,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in">

        {title && (
          <h2 className="text-xl font-semibold mb-4">
            {title}
          </h2>
        )}

        {children}

      </div>
    </div>
  )
}