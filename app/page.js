'use client'
import { useState, useEffect } from "react"
import Head from 'next/head'
import Script from 'next/script'

function Header() {
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Run C in Browser</title>
      </Head>
      <h1>Pokemon Go Espresso</h1>
    </div>
  )
}

export default function HomePage({ num }) {

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
    const input = document.getElementById("inputText").value
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
    const e = document.getElementById("inputText")
    e.value += e.valuess
  }

  const names = [1, 2, 3]
  const [likes, setLikes] = useState(defaultString)

  useEffect(() => {
    const loadWasm = async () => {
      const script = document.createElement('script')
      script.src = '/espresso_bin/wasm_bridge.js'
      script.async = true
      script.onload = async () => {
        run_espresso = Module.cwrap("run_espresso", "number", ["number"])
        allocate = Module.cwrap("allocate_cpp", "number", ["number"])
        free = Module.cwrap("free_cpp", null, ["number"])
        console.log(run_espresso)
      }
      document.body.appendChild(script)
    }

    loadWasm()
  }, [])

  return (
    <div>
      <Header />
      {names.map((n) => (
        <h3 key={n}>{n}</h3>
      ))}

      <h2>Enter Input:</h2>
      <textarea id="inputText" rows="4" cols="50" defaultValue={likes} />
      <br />
      <button onClick={onSubmit}>Submit</button>
      <button onClick={doubleString}>Double</button>
      <h3>Output:</h3>
      <pre id="outputText"></pre>

    </div>
  )
}
