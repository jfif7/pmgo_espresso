"use client"

import { X, RefreshCw, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { UpdateStatus } from "@/types/userData"
import { cn } from "@/lib/utils"

interface UpdatePopupProps {
  status: UpdateStatus
  onUpdate: () => void
  onReload: () => void
  onClose: () => void
}

export function UpdatePopup({
  status,
  onUpdate,
  onReload,
  onClose,
}: UpdatePopupProps) {
  const handleAction = () => {
    if (status === "available") {
      onUpdate()
    } else if (status === "complete") {
      onReload()
    }
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md z-50 px-4">
      <div
        className={cn(
          "p-4 rounded-lg shadow-lg flex items-center justify-between",
          status === "complete"
            ? "bg-green-600 text-white"
            : "bg-primary text-primary-foreground"
        )}
      >
        <div className="mr-4">
          {status === "available" && (
            <>
              <p className="font-medium">New update available!</p>
              <p className="text-sm opacity-90">
                PvPoke's Data has been updated.
              </p>
            </>
          )}
          {status === "updating" && (
            <p className="font-medium">Updating data...</p>
          )}
          {status === "complete" && (
            <>
              <p className="font-medium">Update complete!</p>
              <p className="text-sm opacity-90">
                Please reload the page to see the changes.
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status !== "updating" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAction}
              className={cn(
                "whitespace-nowrap",
                status === "complete" &&
                  "bg-white text-green-700 hover:bg-green-50"
              )}
            >
              {status === "available" && "Update now"}
              {status === "complete" && (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload now
                </>
              )}
            </Button>
          )}

          {status === "updating" && (
            <div className="flex items-center justify-center h-8 w-8">
              <RotateCw className="h-5 w-5 animate-spin" />
            </div>
          )}

          {status !== "updating" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={cn(
                "h-8 w-8",
                status === "complete"
                  ? "text-white/80 hover:text-white hover:bg-white/20"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/20"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
