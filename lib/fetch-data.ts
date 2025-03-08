"use client"

import { useState, useEffect, useRef } from "react"
import {
  CP,
  PokemonID,
  PokemonType,
  GamemasterPokemonTag,
  PokemonFamilyID,
  GamemasterPokemon,
} from "@/types/pokemon"
import { UpdateStatus } from "@/types/userData"

const COMMIT_HASH_KEY = "pvpoke-commit-hash"
const LAST_CHECK_KEY = "pvpoke-last-check"

interface RawGamemasterPokemon {
  dex: number
  speciesId: PokemonID
  speciesName: string
  baseStats: {
    atk: number
    def: number
    hp: number
  }
  types: [PokemonType, PokemonType]
  fastMoves: string[]
  chargedMoves: string[]
  tags?: GamemasterPokemonTag[]
  defaultIVs: {
    cp500: [number, number, number, number]
    cp1500: [number, number, number, number]
    cp2500: [number, number, number, number]
  }
  eliteMoves?: string[]
  searchPriority?: number
  buddyDistance?: number
  thirdMoveCost?: number | false
  released: boolean
  family?: {
    id: PokemonFamilyID
    parent?: PokemonID
    evolutions?: PokemonID[]
  }
}

interface RankingPokemon {
  speciesId: PokemonID
  speciesName: string
  rating: number
  matchups: any[]
  counters: any[]
  moves: any
  moveset: string[]
  score: number
  scores: number[]
  stats: {
    product: number
    atk: number
    def: number
    hp: number
  }
}

type RankingData = RankingPokemon[]

export async function fetchGameMaster(
  forceRefresh = false
): Promise<Record<PokemonID, GamemasterPokemon>> {
  const url =
    "https://raw.githubusercontent.com/pvpoke/pvpoke/refs/heads/master/src/data/gamemaster/pokemon.json"
  return fetchData("gamemaster", url, forceRefresh, parseGamemaster)
}

function parseGamemaster(
  pms: RawGamemasterPokemon[]
): Record<PokemonID, GamemasterPokemon> {
  const index = pms.reduce((acc, pm) => {
    acc[pm.speciesId] = pm
    return acc
  }, {} as Record<PokemonID, RawGamemasterPokemon>)

  const family = pms.reduce((acc, pm) => {
    const familyId = pm.family ? pm.family.id : `FAMILY_${pm.dex}`
    if (!acc[familyId]) {
      acc[familyId] = []
    }
    if (!acc[familyId].includes(pm.dex)) {
      acc[familyId].push(pm.dex)
    }
    return acc
  }, {} as Record<PokemonFamilyID, number[]>)

  const parsed = pms.reduce((acc, p) => {
    const familyId = p.family ? p.family.id : `FAMILY_${p.dex}`
    const parsedPm = {
      dex: p.dex,
      speciesId: p.speciesId,
      speciesName: p.speciesName,
      baseStats: p.baseStats,
      types: p.types,
      tags: p.tags ? p.tags : [],
      needXL: {
        cp500: p.defaultIVs.cp500[0] > 40,
        cp1500: p.defaultIVs.cp1500[0] > 40,
        cp2500: p.defaultIVs.cp2500[0] > 40,
      },
      family: {
        id: familyId,
        candidateDexs: getCandidateDexs(p, index),
        familyDexs: family[familyId],
      },
    }
    acc[p.speciesId] = parsedPm
    return acc
  }, {} as Record<PokemonID, GamemasterPokemon>)

  return parsed
}

function getCandidateDexs(
  pm: RawGamemasterPokemon,
  index: Record<PokemonID, RawGamemasterPokemon>
): number[] {
  let ret = [pm.dex]
  while (pm.family && pm.family.parent) {
    let parent = index[pm.family.parent]
    ret.push(parent.dex)
    pm = parent
  }
  return ret
}

export async function fetchFormat(
  cup: string,
  cp: CP,
  forceRefresh = false
): Promise<PokemonID[]> {
  const baseUrl =
    "https://raw.githubusercontent.com/pvpoke/pvpoke/refs/heads/master/src/data"
  const url = `${baseUrl}/rankings/${cup}/overall/rankings-${cp}.json`
  return fetchData(`${cup}-${cp}`, url, forceRefresh, parseRankingData)
}

function parseRankingData(obj: RankingData): PokemonID[] {
  const parsed = obj.map((rp) => {
    return rp.speciesId
  })
  return parsed
}

export async function fetchCommitHash(): Promise<string> {
  const url =
    "https://api.github.com/repos/pvpoke/pvpoke/commits?path=src/data&sha=master&per_page=1"

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github.v3+json" },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()
    if (data.length === 0) {
      throw new Error("No commits found for the specified directory.")
    }

    console.log("Latest commit hash for src/data:", data[0].sha)
    return data[0].sha // Latest commit hash affecting the directory
  } catch (error) {
    console.error("Error fetching latest commit hash:", error)
  }
}

export async function fetchData(
  id: string,
  url: string,
  forceRefresh = false,
  parser?: (_: any) => any
): Promise<any> {
  // Check localStorage first if not forcing refresh
  if (!forceRefresh) {
    const cachedData = localStorage.getItem(id)
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData)
        console.log(`Using cached ${id}`)
        return data
      } catch (error) {
        console.error(`Error parsing cached ${id}:`, error)
      }
    }
  }

  console.log(`Fetching fresh ${id}`)
  try {
    // GitHub raw content URL for the JSON file
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch ${id}: ${response.status}`)
    }

    let data = await response.json()

    if (parser) {
      data = parser(data)
    }

    localStorage.setItem(id, JSON.stringify(data))

    return data
  } catch (error) {
    console.error(`Error fetching ${id}:`, error)
    throw error
  }
}

export function useCommitCheck() {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus | null>(null)
  const isChecking = useRef(false)
  const latestHashRef = useRef<string | null>(null)

  const checkForUpdates = async () => {
    if (isChecking.current) return

    isChecking.current = true

    try {
      // Check if we should perform the check (only once per 24 hours)
      const now = Date.now()
      const lastCheck = localStorage.getItem(LAST_CHECK_KEY)
      const shouldCheck =
        !lastCheck || now - Number.parseInt(lastCheck, 10) > 24 * 60 * 60 * 1000

      if (shouldCheck) {
        // Update the last check time
        localStorage.setItem(LAST_CHECK_KEY, now.toString())

        // Get the stored commit hash
        const storedHash = localStorage.getItem(COMMIT_HASH_KEY)

        // Fetch the latest commit hash
        const latestHash = await fetchCommitHash()
        latestHashRef.current = latestHash

        if (latestHash && (!storedHash || storedHash !== latestHash)) {
          setUpdateStatus("available")
        }
      }
    } catch (error) {
      console.error("Error checking for updates:", error)
    } finally {
      isChecking.current = false
    }
  }

  const updateData = async () => {
    setUpdateStatus("updating")

    try {
      const hash = latestHashRef.current
      if (hash) {
        localStorage.setItem(COMMIT_HASH_KEY, hash)
        console.log("Updating cached data with latest commit:", hash)
      }
      setUpdateStatus("complete")
    } catch (error) {
      console.error("Error updating data:", error)
      // If there's an error, go back to 'available' state
      setUpdateStatus("available")
    }
  }

  const dismissUpdate = () => {
    setUpdateStatus(null)
  }

  const reloadPage = () => {
    window.location.reload()
  }

  useEffect(() => {
    // Check for updates when the component mounts
    checkForUpdates()
  }, [])

  return {
    updateStatus,
    updateData,
    dismissUpdate,
    reloadPage,
  }
}
