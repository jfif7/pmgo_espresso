"use client"

import type React from "react"

import { forwardRef, useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = useState(checked || false)

    const handleChange = () => {
      const newChecked = !isChecked
      setIsChecked(newChecked)
      onCheckedChange?.(newChecked)
    }

    return (
      <div className="flex items-center">
        <button
          type="button"
          role="checkbox"
          aria-checked={isChecked}
          data-state={isChecked ? "checked" : "unchecked"}
          onClick={handleChange}
          className={cn(
            "h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            isChecked && "bg-primary text-primary-foreground",
            className,
          )}
        >
          {isChecked && <Check className="h-3 w-3 text-current" />}
        </button>
        <input type="checkbox" ref={ref} checked={isChecked} onChange={handleChange} className="sr-only" {...props} />
      </div>
    )
  },
)

Checkbox.displayName = "Checkbox"

export { Checkbox }

