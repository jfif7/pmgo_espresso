import { PokemonID, PokemonFamilyID, CP } from "@/types/pokemon"

export interface UserData {
  strings: Record<string, StringSetting>
  formats: FormatSetting[]
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

export type ThresholdType =
  | "percentRank"
  | "absoluteRank"
  | "percentStatProd"
  | "default"

export interface ThresholdSetting {
  tType: ThresholdType
  tValue: number
}

export interface FormatSetting extends ThresholdSetting {
  id: string
  name: string
  cup: "all"
  cp: CP
  category: "overall"
  active: boolean
  topCut: number
}

export interface BoxData {
  cp500: Set<PokemonID>
  cp1500: Set<PokemonID>
  cp2500: Set<PokemonID>
  cp10000: Set<PokemonID>
  XL: Set<PokemonFamilyID>
}

export type UpdateStatus = "available" | "updating" | "complete"

export interface Format {
  id: string
  cup: "all"
  cp: CP
}
