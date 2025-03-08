"use client"

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import type {
  UserData,
  BoxData,
  FormatSetting,
  StringSetting,
  ThresholdSetting,
} from "@/types/userData"
import type { CP, PokemonID, PokemonFamilyID, CPString } from "@/types/pokemon"

interface UserDataContextType {
  userData: UserData
  updateStringSetting: (id: string, updates: Partial<StringSetting>) => void
  updateFormatSetting: (id: string, updates: Partial<FormatSetting>) => void
  deleteFormatSetting: (id: string) => void
  addToBox: (key: CPString | "XL", id: PokemonID | PokemonFamilyID) => void
  removeFromBox: (key: CPString | "XL", id: PokemonID | PokemonFamilyID) => void
  updateThreshold: (
    cpString: CPString,
    id: PokemonID,
    threshold: ThresholdSetting
  ) => void
}

const UserDataContext = createContext<UserDataContextType | null>(null)
UserDataContext.displayName = "UserDataContext"

const USER_DATA_STORAGE_KEY = "pmgo_user_data"

const defaultUserData: UserData = {
  strings: {},
  formats: [
    {
      id: "all/overall/1500",
      name: "Great League",
      cup: "all",
      category: "overall",
      cp: 1500,
      active: true,
      topCut: 100,
      tType: "percentRank",
      tValue: 99,
    },
    {
      id: "all/overall/2500",
      name: "Ultra League",
      cup: "all",
      category: "overall",
      cp: 2500,
      active: true,
      topCut: 100,
      tType: "percentRank",
      tValue: 99,
    },
    {
      id: "all/overall/10000",
      name: "Master League",
      cup: "all",
      category: "overall",
      cp: 10000,
      active: true,
      topCut: 100,
      tType: "absoluteRank",
      tValue: 1,
    },
  ],
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
    boxes: {
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
      formats: parsed.formats || [],
      boxes: {
        cp500: new Set(parsed.boxes?.cp500 || []),
        cp1500: new Set(parsed.boxes?.cp1500 || []),
        cp2500: new Set(parsed.boxes?.cp2500 || []),
        cp10000: new Set(parsed.boxes?.cp10000 || []),
        XL: new Set(parsed.boxes?.XL || []),
      },
      thresholds: parsed.thresholds || {},
    }
  } catch (error) {
    console.error("Failed to parse user data:", error)
    return { ...defaultUserData }
  }
}

export function UserDataProvider({ children }: { children: ReactNode }) {
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
    setUserData((prevData) => {
      const newFormats = [...prevData.formats]
      // Find format.id === id in newFormats and apply the partial update
      const formatIndex = newFormats.findIndex((format) => format.id === id)
      if (formatIndex !== -1) {
        newFormats[formatIndex] = { ...newFormats[formatIndex], ...updates }
      } else {
        newFormats.push(updates as FormatSetting)
      }
      return {
        ...prevData,
        newFormats,
      }
    })
  }

  // Update a specific format
  const deleteFormatSetting = (id: string) => {
    setUserData((prevData) => {
      let newFormats = [...prevData.formats]
      newFormats = newFormats.filter((format) => format.id !== id)
      return {
        ...prevData,
        newFormats,
      }
    })
  }

  // Add a Pokemon to a box
  const addToBox = (key: CPString | "XL", id: PokemonID | PokemonFamilyID) => {
    setUserData((prevData) => {
      // Create a new Set to avoid direct mutation
      const newSet = new Set(prevData.boxes[key])
      newSet.add(id)

      return {
        ...prevData,
        boxes: {
          ...prevData.boxes,
          [key]: newSet,
        },
      }
    })
  }

  // Remove a Pokemon from a box
  const removeFromBox = (
    key: CPString | "XL",
    id: PokemonID | PokemonFamilyID
  ) => {
    setUserData((prevData) => {
      // Create a new Set to avoid direct mutation
      const newSet = new Set(prevData.boxes[key])
      newSet.delete(id)

      return {
        ...prevData,
        boxes: {
          ...prevData.boxes,
          [key]: newSet,
        },
      }
    })
  }

  // Update (cp, pokemon) specific threshold.
  const updateThreshold = (
    cpString: CPString,
    id: PokemonID,
    threshold: ThresholdSetting
  ) => {
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

  return (
    <UserDataContext.Provider
      value={{
        userData,
        updateStringSetting,
        updateFormatSetting,
        deleteFormatSetting,
        addToBox,
        removeFromBox,
        updateThreshold,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

// Custom hook to use the user data context
export function useUserData() {
  const context = useContext(UserDataContext)
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider")
  }
  if (context === null) {
    throw new Error("UserDataProvider null?")
  }
  return context
}
