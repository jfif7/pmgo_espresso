"use client"

import type React from "react"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number
  max?: number
  min?: number
  step?: number
  onValueChange?: (value: number) => void
}

function Slider({ className, defaultValue = 0, max = 100, min = 0, step = 1, onValueChange, ...props }: SliderProps) {
  const [value, setValue] = useState(defaultValue)
  const sliderRef = useRef<HTMLDivElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(event.target.value)
    setValue(newValue)
    onValueChange?.(newValue)
  }

  const percent = ((value - min) / (max - min)) * 100

  return (
    <div
      ref={sliderRef}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <div className="relative w-full h-2 rounded-full bg-muted overflow-hidden">
        <div className="absolute h-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        className="absolute w-full h-2 opacity-0 cursor-pointer"
      />
      <div
        className="absolute h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        style={{ left: `calc(${percent}% - 0.5rem)` }}
      />
    </div>
  )
}

export { Slider }

