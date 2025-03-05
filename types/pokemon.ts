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
  fastMoves?: string[]
  chargedMoves?: string[]
  rank: number
}

export interface Format {
  id: string
  cup: string
  cp: number
}