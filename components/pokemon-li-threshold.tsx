import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Pokemon, PokemonID, CPString } from "@/types/pokemon"
import { ThresholdSetting, ThresholdType } from "@/types/userData"
import { useUserData } from "@/lib/user-data-context"

interface PokemonLIThresholdProps {
  pokemon: Pokemon
  cpString: CPString
}

export function PokemonLIThreshold({
  pokemon,
  cpString,
}: PokemonLIThresholdProps) {
  const { userData, updateThreshold } = useUserData()
  const threshold = userData.thresholds[cpString][pokemon.speciesId] ?? {
    tType: "default",
    tValue: -1,
  }

  const handleThresholdTypeChange = (tType: ThresholdType) => {
    if (tType === "default") {
      updateThreshold(cpString, pokemon.speciesId, null)
      return
    }
    let value = threshold?.tValue ?? 10
    const newThreshold: ThresholdSetting = {
      tType: tType as ThresholdType,
      tValue: value,
    }
    updateThreshold(cpString, pokemon.speciesId, newThreshold)
  }

  const handleThresholdValueChange = (value: number) => {
    const newThreshold = { ...threshold }
    newThreshold.tValue = value
    updateThreshold(cpString, pokemon.speciesId, newThreshold)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Threshold Settings</h4>
      </div>
      <Tabs
        defaultValue={threshold.tType}
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
              <Label>Top Percentage: {threshold.tValue}%</Label>
            </div>
          </div>
        </TabsContent>
        <TabsContent values={["absoluteRank"]} className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <Label>Top Rank: {threshold.tValue}</Label>
            </div>
          </div>
        </TabsContent>
        <TabsContent values={["percentStatProd"]} className="mt-4">
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <Label>Min Stat Product: {threshold.tValue}%</Label>
            </div>
          </div>
        </TabsContent>
        <TabsContent
          values={["percentRank", "absoluteRank", "percentStatProd"]}
        >
          <div className="space-y-4 p-2">
            <Slider
              defaultValue={threshold.tValue}
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
