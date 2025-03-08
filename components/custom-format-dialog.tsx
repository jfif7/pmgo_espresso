import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { FormatSetting, Category } from "@/types/userData"
import { CP } from "@/types/pokemon"

interface CustomFormatDialogProps {
  addCustomTab: (format: FormatSetting) => void
}

const defaultFormat: FormatSetting = {
  id: "",
  name: "",
  cup: "all",
  category: "overall",
  cp: 1500,
  active: true,
  topCut: 100,
  tType: "percentRank",
  tValue: 1,
}

export default function CustomFormatDialog({
  addCustomTab,
}: CustomFormatDialogProps) {
  const [format, setFormat] = useState<FormatSetting>(defaultFormat)

  const onClick = () => {
    addCustomTab({
      ...format,
      id: format.srcUrl
        ? format.srcUrl
        : `${format.cup}/${format.category}/${format.cp}`,
    })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormat((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const onCatChange = (value: string) => {
    setFormat((prev) => ({
      ...prev,
      category: value as Category,
    }))
  }
  const onCPChange = (value: string) => {
    setFormat((prev) => ({
      ...prev,
      cp: parseInt(value) as CP,
    }))
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Custom Format</DialogTitle>
        <DialogDescription>
          Enter the details for your custom format. Name is required. Either
          provide Cup, Category, and CP or a Source URL.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={format.name}
            onChange={onChange}
            className="col-span-3"
            placeholder="Custom League"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cup" className="text-right">
            Cup {!format.srcUrl && "*"}
          </Label>
          <Input
            id="cup"
            value={format.cup}
            onChange={onChange}
            className="col-span-3"
            placeholder="great"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category {!format.srcUrl && "*"}
          </Label>
          <Select value={format.category} onValueChange={onCatChange}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall</SelectItem>
              <SelectItem value="leads">Leads</SelectItem>
              <SelectItem value="closers">Closers</SelectItem>
              <SelectItem value="attackers">Attackers</SelectItem>
              <SelectItem value="chargers">Chargers</SelectItem>
              <SelectItem value="consistency">Consistency</SelectItem>
              <SelectItem value="switches">Switches</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cp" className="text-right">
            CP {!format.srcUrl && "*"}
          </Label>
          <Select value={`${format.cp}`} onValueChange={onCPChange}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select CP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">500</SelectItem>
              <SelectItem value="1500">1500</SelectItem>
              <SelectItem value="2500">2500</SelectItem>
              <SelectItem value="10000">10000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="srcUrl" className="text-right">
            Source URL
          </Label>
          <Input
            id="srcUrl"
            value={format.srcUrl}
            onChange={onChange}
            className="col-span-3"
            placeholder="https://raw.githubusercontent.com/pvpoke/pvpoke/refs/heads/master/src/data/rankings/all/overall/rankings-1500.json"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onClick}>Add Tab</Button>
      </DialogFooter>
    </DialogContent>
  )
}
