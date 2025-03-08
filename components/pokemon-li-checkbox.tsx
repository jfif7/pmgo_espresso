import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useUserData } from "@/lib/user-data-context"
import { PokemonFamilyID, PokemonID } from "@/types/pokemon"
import { BoxData } from "@/types/userData"
import { memo, useMemo } from "react"

interface PokemonCheckboxProps {
  boxId: keyof BoxData
  pokemonId: PokemonID | PokemonFamilyID
  labelText: string
}

export function PokemonCheckbox({
  boxId,
  pokemonId,
  labelText,
}: PokemonCheckboxProps) {
  const { addToBox, removeFromBox, userData } = useUserData()
  const handleChange = (checked: boolean) => {
    if (checked) {
      addToBox(boxId, pokemonId)
    } else {
      removeFromBox(boxId, pokemonId)
    }
  }
  const checked = userData.boxes[boxId].has(pokemonId)
  const props = useMemo(
    () => ({
      boxId: boxId,
      pokemonId: pokemonId,
      labelText: labelText,
      handleChange: handleChange,
      checked: checked,
    }),
    [boxId, pokemonId, labelText, checked]
  )
  return <MemoInner {...props} />
}

function Inner({ boxId, pokemonId, labelText, checked, handleChange }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={`${boxId}-${pokemonId}`}
        checked={checked}
        onCheckedChange={handleChange}
      />
      <Label htmlFor={`${boxId}-${pokemonId}`} className="text-sm">
        {labelText}
      </Label>
    </div>
  )
}

const MemoInner = memo(Inner)
