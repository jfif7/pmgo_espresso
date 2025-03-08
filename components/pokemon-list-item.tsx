"use client"

import type {
  CP,
  CPString,
  Pokemon,
  PokemonFamilyID,
  PokemonID,
} from "@/types/pokemon"
import { useState, memo } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ThresholdSetting } from "@/types/userData"
import { PokemonLIThreshold } from "./pokemon-li-threshold"
import { useUserData } from "@/lib/user-data-context"

interface PokemonListItemProps {
  listIndex: number
  pokemon: Pokemon
  expanded: boolean
  setExpanding: Function
  selectedCP: CP
}

function CmpPokemonListItemProps(
  prev: Readonly<PokemonListItemProps>,
  next: Readonly<PokemonListItemProps>
): boolean {
  if (prev.expanded !== next.expanded) {
    return false
  }
  if (prev.pokemon.speciesId !== next.pokemon.speciesId) {
    return false
  }
  if (prev.pokemon.rank !== next.pokemon.rank) {
    return false
  }
  return true
}

function PokemonListItem({
  pokemon,
  expanded,
  setExpanding,
  selectedCP,
}: PokemonListItemProps) {
  const [brokenImg, setBrokenImg] = useState(false)
  const { addToBox, removeFromBox, userData } = useUserData()

  const hasXL = userData.boxes.XL.has(pokemon.familyId)
  const cpString = `cp${selectedCP}` as CPString
  const hasCandidate = userData.boxes[cpString].has(pokemon.speciesId)

  function handleExpandClick() {
    setExpanding(expanded ? "" : pokemon.speciesId)
  }

  const handleCandidateChange = (checked: boolean) => {
    if (checked) {
      addToBox(selectedCP, pokemon.speciesId)
    } else {
      removeFromBox(selectedCP, pokemon.speciesId)
    }
  }

  const handleCandyChange = (checked: boolean) => {
    if (checked) {
      addToBox("XL", pokemon.familyId)
    }
  }

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-2">
        {/* Collapsed View */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={
                  brokenImg
                    ? `https://i.pinimg.com/736x/3b/c1/56/3bc1566a5c03743d5e90d23794e27ffb.jpg`
                    : pokemon.sprite_url ||
                      `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${pokemon.dex}.icon.png`
                }
                alt={pokemon.speciesName}
                onError={() => {
                  setBrokenImg(true)
                }}
                fill
                className="object-cover scale-125"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium capitalize">
                  #{pokemon.rank} {pokemon.speciesName}
                </h3>
                {pokemon.needXL && (
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-300"
                  >
                    XL
                  </Badge>
                )}
              </div>
              <div className="flex gap-1 mt-1">
                <Badge
                  className={cn(
                    "text-white",
                    `bg-${pokemon.types[0]}` || "bg-gray-500"
                  )}
                >
                  {pokemon.types[0]}
                </Badge>
                {pokemon.types[1] !== "none" && (
                  <Badge
                    className={cn(
                      "text-white",
                      `bg-${pokemon.types[1]}` || "bg-gray-500"
                    )}
                  >
                    {pokemon.types[1]}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {pokemon.needXL && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`candy-${pokemon.speciesName}`}
                  checked={hasXL}
                  onCheckedChange={handleCandyChange}
                />
                <Label
                  htmlFor={`candy-${pokemon.speciesName}`}
                  className="text-sm"
                >
                  XL Candy
                </Label>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                id={`candidate-${pokemon.speciesName}`}
                checked={hasCandidate}
                onCheckedChange={handleCandidateChange}
              />
              <Label
                htmlFor={`candidate-${pokemon.speciesName}`}
                className="text-sm"
              >
                Candidate
              </Label>
            </div>
            <button
              onClick={handleExpandClick}
              className="ml-2 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded View */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            expanded
              ? "grid-rows-[1fr] opacity-100 mt-4"
              : "grid-rows-[0fr] opacity-0 pointer-events-none"
          )}
        >
          <div className="overflow-hidden">
            <div className="grid gap-6 md:grid-cols-2">
              {/* IV Table */}
              <div>
                <h4 className="font-medium mb-2">Top IVs</h4>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[300px] border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="px-2 py-1 text-left text-sm font-medium">
                          Rank
                        </th>
                        <th className="px-2 py-1 text-left text-sm font-medium">
                          Atk
                        </th>
                        <th className="px-2 py-1 text-left text-sm font-medium">
                          Def
                        </th>
                        <th className="px-2 py-1 text-left text-sm font-medium">
                          HP
                        </th>
                        <th className="px-2 py-1 text-left text-sm font-medium">
                          Stat %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* TODO {pokemon.topIVs.map((iv, index) => ( */}
                      {[[1, 2, 3, 4, 5]].map((iv, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="px-2 py-1 text-sm">{iv[0]}</td>
                          <td className="px-2 py-1 text-sm">{iv[1]}</td>
                          <td className="px-2 py-1 text-sm">{iv[2]}</td>
                          <td className="px-2 py-1 text-sm">{iv[3]}</td>
                          <td className="px-2 py-1 text-sm">
                            {iv[4].toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <PokemonLIThreshold pokemon={pokemon} cpString={cpString} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default memo(PokemonListItem, CmpPokemonListItemProps)
