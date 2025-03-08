import { ThresholdSetting } from "./userData"

export interface Pokemon {
  dex: number
  speciesId: PokemonID
  familyId: PokemonFamilyID
  speciesName: string
  types: [PokemonType, PokemonType]
  baseStats: {
    atk: number
    def: number
    hp: number
  }
  rank: number
  needXL: boolean
  sprite_url?: string
}

export type CP = 500 | 1500 | 2500 | 10000
export type CPString = "cp500" | "cp1500" | "cp2500" | "cp10000"
export type PokemonID = string
export type PokemonFamilyID = string
export type PokemonType =
  | "normal"
  | "fighting"
  | "flying"
  | "poison"
  | "ground"
  | "rock"
  | "bug"
  | "ghost"
  | "steel"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "ice"
  | "dragon"
  | "dark"
  | "fairy"
  | "none"

export type GamemasterPokemonTag =
  | "starter"
  | "shadow"
  | "shadoweligible"
  | "mega"
  | "alolan"
  | "galarian"
  | "hisuian"
  | "mythical"
  | "legendary"
  | "paldean"
  | "regional"
  | "wildlegendary"
  | "ultrabeast"
  | "untradeable"
  | "duplicate"
  | "duplicate1500"
  | "include2500"
  | "include1500"
  | "teambuilderexclude"

export interface GamemasterPokemon {
  dex: number
  speciesId: PokemonID
  speciesName: string
  baseStats: {
    atk: number
    def: number
    hp: number
  }
  types: [PokemonType, PokemonType]
  tags: GamemasterPokemonTag[]
  needXL: {
    cp500: boolean
    cp1500: boolean
    cp2500: boolean
  }
  family: {
    id: PokemonFamilyID
    candidateDexs: number[]
    familyDexs: number[]
  }
}
