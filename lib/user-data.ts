"use client"

import { useEffect, useState } from "react"
import type {
  UserData,
  BoxData,
  FormatSetting,
  StringSetting,
  ThresholdSetting,
} from "@/types/userData"

import type { CP, PokemonID, PokemonFamilyID } from "@/types/pokemon"

const USER_DATA_STORAGE_KEY = "pmgo_user_data"

const defaultUserData: UserData = {
  strings: {},
  formats: {},
  boxes: {
    cp500: new Set<PokemonID>(),
    cp1500: new Set<PokemonID>(),
    cp2500: new Set<PokemonID>(),
    cp10000: new Set<PokemonID>(),
    XL: new Set<PokemonFamilyID>(),
  },
  thresholds: { cp500: {}, cp1500: {}, cp2500: {}, cp10000: {} },
}

// Helper to serialize Sets for localStorage
function serializeUserData(userData: UserData): string {
  const serialized = {
    ...userData,
    box: {
      cp500: Array.from(userData.boxes.cp500),
      cp1500: Array.from(userData.boxes.cp1500),
      cp2500: Array.from(userData.boxes.cp2500),
      cp10000: Array.from(userData.boxes.cp10000),
      XL: Array.from(userData.boxes.XL),
    },
  }
  return JSON.stringify(serialized)
}

// Helper to deserialize Sets from localStorage
function deserializeUserData(jsonString: string): UserData {
  try {
    const parsed = JSON.parse(jsonString)
    return {
      strings: parsed.strings || {},
      formats: parsed.formats || {},
      boxes: {
        cp500: new Set(parsed.box?.cp500 || []),
        cp1500: new Set(parsed.box?.cp1500 || []),
        cp2500: new Set(parsed.box?.cp2500 || []),
        cp10000: new Set(parsed.box?.cp10000 || []),
        XL: new Set(parsed.box?.XL || []),
      },
      thresholds: parsed.thresholds || {},
    }
  } catch (error) {
    console.error("Failed to parse user data:", error)
    return { ...defaultUserData }
  }
}

export function useUserData() {
  const [userData, setUserData] = useState<UserData>(defaultUserData)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(USER_DATA_STORAGE_KEY)
      if (storedData) {
        const parsedData = deserializeUserData(storedData)
        setUserData(parsedData)
      }
    } catch (error) {
      console.error("Failed to load user data from localStorage:", error)
    } finally {
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (!isInitialized) {
      return
    }

    try {
      const serialized = serializeUserData(userData)
      localStorage.setItem(USER_DATA_STORAGE_KEY, serialized)
    } catch (error) {
      console.error("Failed to save user data to localStorage:", error)
    }
  }, [userData, isInitialized])

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prevData) => ({
      ...prevData,
      ...data,
    }))
  }

  // Update a specific string
  const updateStringSetting = (id: string, updates: Partial<StringSetting>) => {
    setUserData((prevData) => ({
      ...prevData,
      strings: {
        ...prevData.strings,
        [id]: {
          ...prevData.strings[id],
          ...updates,
        },
      },
    }))
  }

  // Update a specific format
  const updateFormatSetting = (id: string, updates: Partial<FormatSetting>) => {
    setUserData((prevData) => ({
      ...prevData,
      formats: {
        ...prevData.formats,
        [id]: {
          ...prevData.formats[id],
          ...updates,
        },
      },
    }))
  }

  // Add a Pokemon to a box
  const addToBox = (cp: CP, id: PokemonID | PokemonFamilyID) => {
    const cpString = `cp${cp}`
    setUserData((prevData) => {
      // Create a new Set to avoid direct mutation
      const newSet = new Set(prevData.boxes[cpString])
      newSet.add(id)

      return {
        ...prevData,
        boxes: {
          ...prevData.boxes,
          [cpString]: newSet,
        },
      }
    })
  }

  // Remove a Pokemon from a box
  const removeFromBox = (cp: CP, id: PokemonID | PokemonFamilyID) => {
    const cpString = `cp${cp}`
    setUserData((prevData) => {
      // Create a new Set to avoid direct mutation
      const newSet = new Set(prevData.boxes[cpString])
      newSet.delete(id)

      return {
        ...prevData,
        boxes: {
          ...prevData.boxes,
          [cpString]: newSet,
        },
      }
    })
  }

  // Update (cp, pokemon) specific threshold.
  const updateThreshold = (
    cp: CP,
    id: PokemonID,
    threshold: ThresholdSetting
  ) => {
    const cpString = `cp${cp}`
    setUserData((prevData) => {
      const updatedThresholds = { ...prevData.thresholds }
      if (threshold === null) {
        /* Delete prevData.thresholds[cp][id] if exists */
        if (updatedThresholds[cpString] && updatedThresholds[cpString][id]) {
          delete updatedThresholds[cpString][id]
        }
      } else {
        updatedThresholds[cpString] = {
          ...updatedThresholds[cpString],
          [id]: threshold,
        }
      }
      return {
        ...prevData,
        thresholds: updatedThresholds,
      }
    })
  }

  return {
    userData,
    updateStringSetting,
    updateFormatSetting,
    addToBox,
    removeFromBox,
    updateThreshold,
  }
}
