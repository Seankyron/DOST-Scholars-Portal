// src/components/ui/modal.tsx
"use client"

import * as React from "react"
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent, // This is the base Radix component
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog" // Using your robust dialog.tsx as the base
import { cn } from "@/lib/utils/cn"

// --- Re-exporting the base components ---
const Modal = Dialog
const ModalTrigger = DialogTrigger
const ModalClose = DialogClose
const ModalHeader = DialogHeader
const ModalFooter = DialogFooter
const ModalTitle = DialogTitle
const ModalDescription = DialogDescription

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-6 py-4", className)} // Reverted to simple padding
    {...props}
  />
))
ModalBody.displayName = "ModalBody"

// --- Upgraded ModalContent with size props ---
interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  ModalContentProps
>(({ className, children, size = "md", ...props }, ref) => {
  const sizes = {
    sm: "sm:max-w-lg",
    md: "sm:max-w-xl",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl", // 56rem
    "2xl": "sm:max-w-5xl", // 64rem
    "3xl": "sm:max-w-6xl", // 72rem
    "4xl": "sm:max-w-7xl", // 80rem (approx 1280px)
    full: "sm:max-w-[calc(100%-2rem)]",
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogContent // This is the base Radix DialogContent
        ref={ref}
        className={cn(
          "w-full", 
          sizes[size], 
          className
        )}
        {...props}
      >
        {children} 
        {/* We keep the X close button from dialog.tsx */}
      </DialogContent>
    </DialogPortal>
  )
})
ModalContent.displayName = "ModalContent"

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
  ModalBody,
}