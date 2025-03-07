import { CP, PokemonID, PokemonFamilyID } from "@/types/pokemon"

export interface UserData {
  strings: Record<string, StringSetting>
  formats: Record<string, FormatSetting>
  boxes: BoxData
  thresholds: Record<CP, Record<PokemonID, ThresholdSetting>>
}

export interface StringSetting {
  suffix: string
}

export type ThresholdType = "percentRank" | "absoluteRank" | "percentStatProd"

export interface ThresholdSetting {
  thresholdType: ThresholdType
  thresholdValue: number
}

export interface FormatSetting extends ThresholdSetting {
  active: boolean
  topCut: number
  name: string
}

export interface BoxData {
  500: Set<PokemonID>
  1500: Set<PokemonID>
  2500: Set<PokemonID>
  10000: Set<PokemonID>
  XL: Set<PokemonFamilyID>
}

export type UpdateStatus = "available" | "updating" | "complete"
