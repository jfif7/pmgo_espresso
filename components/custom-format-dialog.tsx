import { Button } from "./ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

interface CustomFormatDialogProps {
  addCustomTab: (_0: string, _1: string) => void
}

export default function CustomFormatDialog({
  addCustomTab,
}: CustomFormatDialogProps) {
  const [customTabName, setCustomTabName] = useState("")
  const [customTabValue, setCustomTabValue] = useState("")

  const onClick = () => {
    addCustomTab(customTabName, customTabValue)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Custom Tab</DialogTitle>
        <DialogDescription>
          Enter the details for your custom tab.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={customTabName}
            onChange={(e) => setCustomTabName(e.target.value)}
            className="col-span-3"
            placeholder="Custom League"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="value" className="text-right">
            Format
          </Label>
          <Input
            id="format"
            value={customTabValue}
            onChange={(e) => setCustomTabValue(e.target.value)}
            className="col-span-3"
            placeholder="1234"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onClick}>Add Tab</Button>
      </DialogFooter>
    </DialogContent>
  )
}
