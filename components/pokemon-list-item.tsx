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
import { PokemonLIThreshold } from "./pokemon-li-threshold"
import { useUserData } from "@/lib/user-data-context"
import { PokemonCheckbox } from "./pokemon-li-checkbox"
import { PokemonLIExpand } from "./pokemon-li-expand"

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

  const cpString = `cp${selectedCP}` as CPString

  function handleExpandClick() {
    setExpanding(expanded ? "" : pokemon.speciesId)
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
              <PokemonCheckbox
                boxId="XL"
                pokemonId={pokemon.familyId}
                labelText="XL Candy"
              />
            )}
            <PokemonCheckbox
              boxId={cpString}
              pokemonId={pokemon.speciesId}
              labelText="Candidate"
            />
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
        {expanded && <PokemonLIExpand pokemon={pokemon} cp={selectedCP} />}
      </div>
    </Card>
  )
}

export default memo(PokemonListItem, CmpPokemonListItemProps)
