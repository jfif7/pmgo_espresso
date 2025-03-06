
export interface UserData {
  strings: Record<string, StringData>
  cups: Record<string, CupData>
  box: BoxData
}

export interface StringData {
  suffix: string
}

export interface CupData {
  thresholdType: 'percentRank' | 'absoluteRank' | 'percentStatProd'
  thresholdValue: number
  active: boolean
}

type PokemonID = string
type PokemonFamilyID = string

export interface BoxData {
  500: Set<PokemonID>
  1500: Set<PokemonID>
  2500: Set<PokemonID>
  10000: Set<PokemonID>
  XL: Set<PokemonFamilyID>
}
