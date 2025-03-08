"use client"
import { useState, useEffect } from "react"
import Head from "next/head"
import Script from "next/script"
import PokemonList from "./pokemon-list"
import { fetchGameMaster, fetchFormat, useCommitCheck } from "@/lib/fetch-data"
import {
  Format,
  PokemonID,
  PokemonFamilyID,
  GamemasterPokemon,
  Pokemon,
} from "@/types/pokemon"
import { UserData } from "@/types/userData"
import { useUserData } from "@/lib/user-data"
import { UpdatePopup } from "@/components/update-popup"

declare const Module: any

function Header() {
  return (
    <div>
      {process.env.NODE_ENV == "development" && (
        <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
      )}
      <h1 className="bg-background text-3xl font-bold underline p-4">
        Pokemon Go Espresso
      </h1>
    </div>
  )
}

export default function HomePage() {
  const [gamemaster, setGamemaster] = useState<
    Record<PokemonID, GamemasterPokemon>
  >({})
  const [rankingData, setRankingData] = useState<PokemonID[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFormat, setSelectedFormat] = useState<Format>({
    id: "1500",
    cup: "all",
    cp: 1500,
  })
  const { updateStatus, updateData, dismissUpdate, reloadPage } =
    useCommitCheck()
  const {
    userData,
    updateStringSetting,
    updateFormatSetting,
    addToBox,
    removeFromBox,
    updateThreshold,
  } = useUserData()

  let run_espresso, allocate, free
  const defaultString = `.i 2
.o 2
.p 4
00 10
01 01
11 -1
10 1-
.e`

  function onSubmit() {
    // Prepare input
    const input = (document.getElementById("inputText") as HTMLInputElement)
      .value
    console.log(input)
    console.log(input.length)
    const buffer_size = input.length + 1
    const inputPtr = allocate(buffer_size)
    Module.stringToUTF8(input, inputPtr, buffer_size)
    // Call
    const resultPtr = run_espresso(inputPtr)
    // Reading output
    const result = Module.UTF8ToString(resultPtr)
    console.log(result)
    console.log("result len:", result.length)
    document.getElementById("outputText").innerText = `Return: ${result}`
    // Cleanup
    free(inputPtr)
    free(resultPtr)
  }

  function doubleString() {
    const e = document.getElementById("inputText") as HTMLInputElement
    e.value += e.value
  }

  async function loadPokemonData(format: Format) {
    setLoading(true)
    try {
      const gm = await fetchGameMaster()
      setGamemaster(gm)
      const format_data = await fetchFormat(format.cup, format.cp)
      setRankingData(format_data)
    } catch (error) {
      console.error("Error loading Pokemon data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPokemonData(selectedFormat)
  }, [selectedFormat])

  useEffect(() => {
    const loadWasm = async () => {
      const script = document.createElement("script")
      script.src = "/espresso_bin/wasm_bridge.js"
      script.async = true
      script.onload = async () => {
        run_espresso = Module.cwrap("run_espresso", "number", ["number"])
        allocate = Module.cwrap("allocate_cpp", "number", ["number"])
        free = Module.cwrap("free_cpp", null, ["number"])
      }
      document.body.appendChild(script)
    }

    loadWasm()
  }, [])

  let pokemonList: Pokemon[] = rankingData
    .map((speciesId, index) => {
      let p = gamemaster[speciesId]
      if (p) {
        return {
          dex: p.dex,
          speciesId: p.speciesId,
          speciesName: p.speciesName,
          types: p.types,
          baseStats: p.baseStats,
          rank: index + 1,
          needXL:
            selectedFormat.cp == 10000
              ? true
              : p.needXL[`cp${selectedFormat.cp}`],
          hasXL: true, // TODO
          hasCandidate: true, // TODO
          threshold: null, // TODO
        } as Pokemon
      }
      return {
        dex: -1,
      } as Pokemon
    })
    .slice(0, 300)

  let formats: Format[] = [
    {
      id: "1500",
      cup: "all",
      cp: 1500,
    },
    {
      id: "2500",
      cup: "all",
      cp: 2500,
    },
    {
      id: "10000",
      cup: "all",
      cp: 10000,
    },
  ]

  return (
    <div>
      <Header />
      <select
        onChange={(e) =>
          setSelectedFormat(formats.find((f) => f.id === e.target.value))
        }
        defaultValue={"1500"}
      >
        {formats.map((format) => {
          return (
            <option value={format.id} key={format.id}>
              {format.id}
            </option>
          )
        })}
      </select>
      <PokemonList pokemonList={pokemonList} />
      <h2>Enter Input:</h2>
      <textarea
        id="inputText"
        rows={4}
        cols={50}
        defaultValue={defaultString}
      />
      <br />
      <button onClick={onSubmit}>Submit</button>
      <button onClick={doubleString}>Double</button>
      <h3>Output:</h3>
      <pre id="outputText"></pre>
      {updateStatus && (
        <UpdatePopup
          status={updateStatus}
          onUpdate={updateData}
          onReload={reloadPage}
          onClose={dismissUpdate}
        />
      )}
    </div>
  )
}
