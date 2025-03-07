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
    500: new Set<PokemonID>(),
    1500: new Set<PokemonID>(),
    2500: new Set<PokemonID>(),
    10000: new Set<PokemonID>(),
    XL: new Set<PokemonFamilyID>(),
  },
  thresholds: { 500: {}, 1500: {}, 2500: {}, 10000: {} },
}

// Helper to serialize Sets for localStorage
function serializeUserData(userData: UserData): string {
  const serialized = {
    ...userData,
    box: {
      500: Array.from(userData.boxes[500]),
      1500: Array.from(userData.boxes[1500]),
      2500: Array.from(userData.boxes[2500]),
      10000: Array.from(userData.boxes[10000]),
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
        500: new Set(parsed.box?.[500] || []),
        1500: new Set(parsed.box?.[1500] || []),
        2500: new Set(parsed.box?.[2500] || []),
        10000: new Set(parsed.box?.[10000] || []),
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
  const addToBox = (cp: keyof BoxData, id: PokemonID | PokemonFamilyID) => {
    setUserData((prevData) => {
      // Create a new Set to avoid direct mutation
      const newSet = new Set(prevData.boxes[cp])
      newSet.add(id)

      return {
        ...prevData,
        boxes: {
          ...prevData.boxes,
          [cp]: newSet,
        },
      }
    })
  }

  // Remove a Pokemon from a box
  const removeFromBox = (
    cp: keyof BoxData,
    id: PokemonID | PokemonFamilyID
  ) => {
    setUserData((prevData) => {
      // Create a new Set to avoid direct mutation
      const newSet = new Set(prevData.boxes[cp])
      newSet.delete(id)

      return {
        ...prevData,
        boxes: {
          ...prevData.boxes,
          [cp]: newSet,
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
    setUserData((prevData) => {
      const updatedThresholds = { ...prevData.thresholds }
      if (threshold === null) {
        /* Delete prevData.thresholds[cp][id] if exists */
        if (updatedThresholds[cp] && updatedThresholds[cp][id]) {
          delete updatedThresholds[cp][id]
        }
      } else {
        updatedThresholds[cp] = {
          ...updatedThresholds[cp],
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
