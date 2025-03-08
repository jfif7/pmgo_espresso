import { CPString } from "@/types/pokemon"
import { PokemonLIThreshold } from "./pokemon-li-threshold"

export function PokemonLIExpand({ pokemon, cp }) {
  const cpString = `cp${cp}` as CPString
  return (
    <div className="grid transition-all duration-300 ease-in-out grid-rows-[1fr] opacity-100 mt-4">
      <div className="overflow-hidden">
        <div className="grid gap-6 md:grid-cols-2">
          {/* IV Table */}
          <div>
            <h4 className="font-medium mb-2">Top IVs</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[300px] border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="px-2 py-1 text-left text-sm font-medium">
                      Rank
                    </th>
                    <th className="px-2 py-1 text-left text-sm font-medium">
                      Atk
                    </th>
                    <th className="px-2 py-1 text-left text-sm font-medium">
                      Def
                    </th>
                    <th className="px-2 py-1 text-left text-sm font-medium">
                      HP
                    </th>
                    <th className="px-2 py-1 text-left text-sm font-medium">
                      Stat %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* TODO {pokemon.topIVs.map((iv, index) => ( */}
                  {[[1, 2, 3, 4, 5]].map((iv, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="px-2 py-1 text-sm">{iv[0]}</td>
                      <td className="px-2 py-1 text-sm">{iv[1]}</td>
                      <td className="px-2 py-1 text-sm">{iv[2]}</td>
                      <td className="px-2 py-1 text-sm">{iv[3]}</td>
                      <td className="px-2 py-1 text-sm">{iv[4].toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <PokemonLIThreshold pokemon={pokemon} cpString={cpString} />
        </div>
      </div>
    </div>
  )
}
