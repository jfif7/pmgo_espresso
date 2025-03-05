'use client'

import type { Pokemon } from "@/types/pokemon"
import { useState } from 'react'
import { ChevronDown, ChevronUp,RotateCcw, HelpCircle, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PokemonListItemProps {
  pokemon: Pokemon
  expanded: boolean
  setExpanding: Function
}

export default function PokemonListItem({ pokemon, expanded, setExpanding}: PokemonListItemProps) {
  const [hasCand, setHasCand] = useState(false)
  const [hasCandy, setHasCandy] = useState(false)

  function handleClick() {
    setExpanding(expanded?"":pokemon.speciesId)
  }

  const handleCandidateChange = (checked: boolean) => {
  }

  const handleCandyChange = (checked: boolean) => {
  }

  const handleThresholdTypeChange = (value: string) => {
  }

  const handleThresholdValueChange = (value: number[]) => {
  }

  const handleReset = () => {
  }

  const localThresholdValue = 10


  // return (<div className="mb-2">
  //   <div
  //     className={`grid grid-cols-12 gap-2 items-center bg-${pokemon.types[0]} rounded-lg p-3 cursor-pointer overflow-hidden`}
  //     onClick={handleClick}
  //   >
  //     <div className="col-span-1 text-center">
  //       {expanded && <Minus size={20} className="mx-auto" />}
  //       {!expanded && <Plus size={20} className="mx-auto" />}
  //     </div>
  //     <div className="col-span-7 md:col-span-8">
  //       <div className="flex items-center gap-2">
  //         <span className="font-bold">#{pokemon.rank}</span>
  //         <span className="font-bold">{pokemon.speciesName}</span>
  //         <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">XL</span>
  //       </div>
  //     </div>
  //     <div className="col-span-4 md:col-span-3 text-right">
  //       <div className="bg-gray-700 text-white font-bold py-1 px-3 rounded-lg inline-block">95.4</div>
  //     </div>
  //   </div>
  //     {expanded && (
  //     <div>
  //       <label>
  //         <input
  //           type="checkbox"
  //           checked={hasCand}
  //           onChange={e => setHasCand(e.target.checked)}
  //         />
  //         Has Candidate
  //       </label>
  //       <label>
  //         <input
  //           type="checkbox"
  //           checked={hasCandy}
  //           onChange={e => setHasCandy(e.target.checked)}
  //         />
  //         Has Candy
  //       </label>
  //     </div>
  //     )}
  // </div>)
  
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-2">
        {/* Collapsed View */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={pokemon.sprite_url || `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets/Images/Pokemon%20-%20256x256/Addressable%20Assets/pm${pokemon.dex}.icon.png`}
                alt={pokemon.speciesName}
                fill
                className="object-cover scale-125"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium capitalize">{pokemon.speciesName}</h3>
                {pokemon.needXL && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    XL
                  </Badge>
                )}
              </div>
              <div className="flex gap-1 mt-1">
                <Badge className={cn("text-white", `bg-${pokemon.types[0]}` || "bg-gray-500")}>
                  {pokemon.types[0]}
                </Badge>
                {pokemon.types[1] !== "none" && (
                  <Badge className={cn("text-white", `bg-${pokemon.types[0]}` || "bg-gray-500")}>
                    {pokemon.types[1]}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`candidate-${pokemon.speciesName}`}
                checked={pokemon.hasCandidate}
                onCheckedChange={handleCandidateChange}
              />
              <Label htmlFor={`candidate-${pokemon.speciesName}`} className="text-sm">
                Candidate
              </Label>
            </div>
            {pokemon.needXL && (
              <div className="flex items-center gap-2">
                <Checkbox id={`candy-${pokemon.speciesName}`} checked={pokemon.hasCandy} onCheckedChange={handleCandyChange} />
                <Label htmlFor={`candy-${pokemon.speciesName}`} className="text-sm">
                  XL Candy
                </Label>
              </div>
            )}
            <button
              onClick={handleClick}
              className="ml-2 p-1 rounded-full hover:bg-muted transition-colors"
              aria-label={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Expanded View */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out",
            expanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 pointer-events-none",
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
                        <th className="px-2 py-1 text-left text-sm font-medium">Rank</th>
                        <th className="px-2 py-1 text-left text-sm font-medium">Atk</th>
                        <th className="px-2 py-1 text-left text-sm font-medium">Def</th>
                        <th className="px-2 py-1 text-left text-sm font-medium">HP</th>
                        <th className="px-2 py-1 text-left text-sm font-medium">Stat %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {pokemon.topIVs.map((iv, index) => ( */}
                      {[[1,2,3,4,5]].map((iv, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="px-2 py-1 text-sm">{iv[0]}</td>
                          <td className="px-2 py-1 text-sm">{iv[1]}</td>
                          <td className="px-2 py-1 text-sm">{iv[2]}</td>
                          <td className="px-2 py-1 text-sm">{iv[3]}</td>
                          <td className="px-2 py-1 text-sm">{iv[4].toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Threshold Settings */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Threshold Settings</h4>
                  <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-1">
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                </div>
                <Tabs defaultValue={pokemon.thresholdType} onValueChange={handleThresholdTypeChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="default">Same as cup</TabsTrigger>
                    <TabsTrigger value="percentRank">% Rank</TabsTrigger>
                    <TabsTrigger value="absoluteRank">Abs Rank</TabsTrigger>
                    <TabsTrigger value="percentStatProd">% Stat</TabsTrigger>
                  </TabsList>
                  <TabsContent values={["percentRank"]} className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between mb-2">
                        <Label>Top Percentage: {localThresholdValue}%</Label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent values={["absoluteRank"]} className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between mb-2">
                        <Label>Top Rank: {localThresholdValue}</Label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent values={["percentStatProd"]} className="mt-4">
                    <div className="space-y-4">
                      <div className="flex justify-between mb-2">
                        <Label>Min Stat Product: {localThresholdValue}%</Label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent values={["percentRank", "absoluteRank", "percentStatProd"]}>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={localThresholdValue}
                        max={100}
                        step={1}
                        onValueChange={handleThresholdValueChange}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}