import { PokemonID, PokemonFamilyID } from "@/types/pokemon"

export interface UserData {
  strings: Record<string, StringSetting>
  formats: Record<string, FormatSetting>
  boxes: BoxData
  thresholds: {
    cp500: Record<PokemonID, ThresholdSetting>
    cp1500: Record<PokemonID, ThresholdSetting>
    cp2500: Record<PokemonID, ThresholdSetting>
    cp10000: Record<PokemonID, ThresholdSetting>
  }
}

export interface StringSetting {
  suffix: string
}

export type ThresholdType = "percentRank" | "absoluteRank" | "percentStatProd"

export interface ThresholdSetting {
  tType: ThresholdType
  tValue: number
}

export interface FormatSetting extends ThresholdSetting {
  active: boolean
  topCut: number
  name: string
}

export interface BoxData {
  cp500: Set<PokemonID>
  cp1500: Set<PokemonID>
  cp2500: Set<PokemonID>
  cp10000: Set<PokemonID>
  XL: Set<PokemonFamilyID>
}

export type UpdateStatus = "available" | "updating" | "complete"
