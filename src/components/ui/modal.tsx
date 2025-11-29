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
    className={cn("py-4", className)} 
    {...props}
  />
))
ModalBody.displayName = "ModalBody"

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
    full: "sm:max-w-[95vw]", 
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogContent 
        ref={ref}
        className={cn(
          // --- MOBILE OPTIMIZATIONS ---
          // 1. Width: 95% on mobile, specific max-width on desktop
          "w-[95%] sm:w-full",
          
          // 2. Height & Scroll: Ensure modal never exceeds viewport height 
          //    and allows scrolling internally if content is too long.
          "max-h-[calc(100dvh-2rem)] overflow-y-auto scrollbar-thin",
          
          // 3. Spacing: Tighter padding on mobile (p-4) vs desktop (p-6)
          "p-4 sm:p-6",
          
          // 4. Grid gap: reduced slightly on mobile to save space
          "gap-4 sm:gap-6",

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