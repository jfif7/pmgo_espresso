import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Pokemon, CP, PokemonID } from "@/types/pokemon"
import { ThresholdSetting, ThresholdType } from "@/types/userData"

interface PokemonLIThresholdProps {
  pokemon: Pokemon
  selectedCP: CP
  updateThreshold: (cp: CP, id: PokemonID, threshold: ThresholdSetting) => void
}

export function PokemonLIThreshold({
  pokemon,
  selectedCP,
  updateThreshold,
}: PokemonLIThresholdProps) {
  const thresholdType = pokemon.threshold?.tType ?? "default"
  const thresholdVal = pokemon.threshold?.tValue ?? -1

  const handleThresholdTypeChange = (tType: ThresholdType | "default") => {
    if (tType == "default") {
      updateThreshold(selectedCP, pokemon.speciesId, null)
      return
    }
    let value = 10
    if (pokemon.threshold) {
      value = pokemon.threshold.tValue
    }
    const newThreshold: ThresholdSetting = {
      tType: tType as ThresholdType,
      tValue: value,
    }
    updateThreshold(selectedCP, pokemon.speciesId, newThreshold)
  }

  const handleThresholdValueChange = (value: number) => {
    const newThreshold = { ...pokemon.threshold }
    newThreshold.tValue = value
    updateThreshold(selectedCP, pokemon.speciesId, newThreshold)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Threshold Settings</h4>
      </div>
      <Tabs
        defaultValue={thresholdType}
        onValueChange={handleThresholdTypeChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="percentRank">% Rank</TabsTrigger>
          <TabsTrigger value="absoluteRank">Abs Rank</TabsTrigger>
          <TabsTrigger value="percentStatProd">% Stat</TabsTrigger>
        </TabsList>
        <TabsContent values={["percentRank"]} className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <Label>Top Percentage: {thresholdVal}%</Label>
            </div>
          </div>
        </TabsContent>
        <TabsContent values={["absoluteRank"]} className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <Label>Top Rank: {thresholdVal}</Label>
            </div>
          </div>
        </TabsContent>
        <TabsContent values={["percentStatProd"]} className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <Label>Min Stat Product: {thresholdVal}%</Label>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          values={["percentRank", "absoluteRank", "percentStatProd"]}
        >
          <div className="space-y-4 p-2">
            <Slider
              defaultValue={thresholdVal}
              min={1}
              max={100}
              step={1}
              onValueChange={handleThresholdValueChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
