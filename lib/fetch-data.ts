"use client"

import { useState, useEffect, useRef } from "react"
import { CP } from "@/types/pokemon"
import { UpdateStatus } from "@/types/userData"

const COMMIT_HASH_KEY = "pvpoke-commit-hash"
const LAST_CHECK_KEY = "pvpoke-last-check"

export async function fetchGameMaster(forceRefresh = false): Promise<any> {
  const url =
    "https://raw.githubusercontent.com/pvpoke/pvpoke/refs/heads/master/src/data/gamemaster/pokemon.json"
  return fetchData("gamemaster", url, forceRefresh)
}

export async function fetchFormat(
  cup: string,
  cp: CP,
  forceRefresh = false
): Promise<any> {
  const baseUrl =
    "https://raw.githubusercontent.com/pvpoke/pvpoke/refs/heads/master/src/data"
  const url = `${baseUrl}/rankings/${cup}/overall/rankings-${cp}.json`
  return fetchData(`${cup}-${cp}`, url, forceRefresh, formatParser)
}

function formatParser(obj:any):any {
  return {
    name:"aaa"
  }
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
  parser?:(_: any)=>any
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
