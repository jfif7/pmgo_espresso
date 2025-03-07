import { ThresholdSetting } from "./userData"

export interface Pokemon {
  dex: number
  speciesId: string
  speciesName: string
  types: string[]
  baseStats: {
    atk: number
    def: number
    hp: number
  }
  rank: number
  needXL: boolean
  hasXL: boolean
  hasCandidate: boolean
  threshold: ThresholdSetting
}

export type CP = 500 | 1500 | 2500 | 10000
export type PokemonID = string
export type PokemonFamilyID = string

export interface Format {
  id: string
  cup: "all"
  cp: CP
}
