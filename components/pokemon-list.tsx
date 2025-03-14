"use client"

import type { CP, Pokemon, PokemonFamilyID, PokemonID } from "@/types/pokemon"
import { useState, useEffect } from "react"
import { RefreshCw, Search } from "lucide-react"
import PokemonListItem from "./pokemon-list-item"
import { BoxData, ThresholdSetting } from "@/types/userData"

interface PokemonListProps {
  pokemonList: Pokemon[]
  selectedCP: CP
}

export default function PokemonList({
  pokemonList,
  selectedCP,
}: PokemonListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expanding, setExpanding] = useState("")

  const handleRefresh = () => {
    console.log("handleRefresh")
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // const filteredPokemon = pokemonList.filter(
  //   (p) =>
  //     p.speciesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     p.speciesId.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  if (pokemonList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row mb-6 gap-4 max-w-4xl mx-auto">
        <div className="relative w-full sm:w-64">
          <label className="text-muted-foreground">Hide irrelevant</label>
          <input type="checkbox" className="pl-8" />
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-4 p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Pokemon List</h2>
        {pokemonList.map((p, index) => (
          <PokemonListItem
            key={p.speciesId}
            listIndex={index}
            pokemon={p}
            expanded={expanding == p.speciesId}
            setExpanding={setExpanding}
            selectedCP={selectedCP}
          />
        ))}
      </div>

      {pokemonList.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">
            No Pokemon found matching your search.
          </p>
        </div>
      )}

      {/* <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredPokemon.length} of {pokemonList.length} Pokemon
      </div> */}
    </div>
  )
}
