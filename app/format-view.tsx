"use client"

import { Pokemon, PokemonFamilyID, PokemonID } from "@/types/pokemon";
import PokemonList from "./pokemon-list";
import type { FormatSetting } from "@/types/userData";

interface FormatViewProps {
  formatSetting: FormatSetting
  candidate: Set<PokemonID>
  hasXL: Set<PokemonFamilyID>
  rankings: Pokemon[]
}