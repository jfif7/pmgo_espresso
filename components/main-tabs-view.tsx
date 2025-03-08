"use client"

import { useState, useRef, type DragEvent } from "react"
import { Plus, X, GripVertical } from "lucide-react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import CustomFormatDialog from "./custom-format-dialog"
import { FormatSetting } from "@/types/userData"

// Define the tab types
interface Tab {
  id: string
  label: string
  value: string
  removable: boolean
}

interface FormatTab extends Tab {
  format: FormatSetting
}

// Define the tab content props
interface TabContentProps {
  value: string
  label: string
}

// Tab content component that's shared between all tabs except Summary
const TabContentView = ({ value, label }: TabContentProps) => {
  return (
    <div className="p-4 border rounded-lg mt-2">
      <h2 className="text-xl font-semibold mb-4">{label} Content</h2>
      <p>
        This is the content for the {label} tab with value: {value}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Statistics</h3>
          <p>CP: {value}</p>
          <p>Pokémon Count: {Math.floor(Math.random() * 500) + 100}</p>
        </div>
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Top Performers</h3>
          <ul className="list-disc pl-5">
            <li>Mewtwo</li>
            <li>Dragonite</li>
            <li>Tyranitar</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Summary tab content
const SummaryContent = () => {
  return (
    <div className="p-4 border rounded-lg mt-2">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <p className="mb-4">
        Welcome to the Pokémon GO Espresso dashboard. Here you can view
        different CP league statistics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Total Pokémon</h3>
          <p className="text-2xl font-bold">721</p>
        </div>
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Available Leagues</h3>
          <p className="text-2xl font-bold">4</p>
        </div>
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium mb-2">Last Updated</h3>
          <p className="text-2xl font-bold">Today</p>
        </div>
      </div>
    </div>
  )
}

export default function MainTabView() {
  // Initial tabs and options
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "summary", label: "Summary", value: "summary", removable: false },
  ])
  const [formatTabs, setFormatTabs] = useState<FormatTab[]>([])
  const [availableOptions, setAvailableOptions] = useState<string[]>([
    "500",
    "1500",
    "2500",
    "10000",
  ])
  const [activeTab, setActiveTab] = useState("summary")
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
  const [draggedTab, setDraggedTab] = useState<string | null>(null)
  const [dragOverTab, setDragOverTab] = useState<string | null>(null)

  // Ref for the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Add a new tab
  const addTab = (option: string) => {
    const newTab: FormatTab = {
      id: option.toLowerCase(),
      label: `${option} CP`,
      value: option,
      removable: true,
      format: {
        id: `${option} CP`,
        cup: "all",
        category: "overall",
        topCut: 100,
        name: `${option} CP`,
        cp: 2500,
        active: true,
        tType: "percentRank",
        tValue: 1,
      },
    }

    setFormatTabs([...formatTabs, newTab])
    setActiveTab(option.toLowerCase())

    // Remove the option from available options
    setAvailableOptions(availableOptions.filter((opt) => opt !== option))
  }

  // Remove a tab
  const removeTab = (tabId: string) => {
    const tabToRemove = tabs.find((tab) => tab.id === tabId)

    if (tabToRemove && tabToRemove.removable) {
      // Add the option back to available options if it's a standard option
      if (["500", "1500", "2500", "10000"].includes(tabToRemove.value)) {
        setAvailableOptions([...availableOptions, tabToRemove.value].sort())
      }

      // Remove the tab
      setTabs(tabs.filter((tab) => tab.id !== tabId))

      // If the active tab is being removed, set active tab to summary
      if (activeTab === tabId) {
        setActiveTab("summary")
      }
    }
  }

  // Add a custom tab
  const addCustomTab = (customTabName, customTabValue) => {
    if (customTabName && customTabValue) {
      const newTab: Tab = {
        id: `custom-${Date.now()}`,
        label: customTabName,
        value: customTabValue,
        removable: true,
      }

      setTabs([...tabs, newTab])
      setActiveTab(newTab.id)
      setIsCustomModalOpen(false)
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, tabId: string) => {
    setDraggedTab(tabId)
    // Set the drag image to be the tab element
    if (e.dataTransfer && e.currentTarget) {
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", tabId)

      // Create a ghost image for dragging
      const ghostElement = e.currentTarget.cloneNode(true) as HTMLDivElement
      ghostElement.style.position = "absolute"
      ghostElement.style.top = "-1000px"
      ghostElement.style.opacity = "0.8"
      document.body.appendChild(ghostElement)

      e.dataTransfer.setDragImage(ghostElement, 20, 20)

      // Remove the ghost element after a short delay
      setTimeout(() => {
        document.body.removeChild(ghostElement)
      }, 0)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, tabId: string) => {
    e.preventDefault()
    if (draggedTab && draggedTab !== tabId) {
      setDragOverTab(tabId)
    }
  }

  const handleDragEnd = () => {
    setDraggedTab(null)
    setDragOverTab(null)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetTabId: string) => {
    e.preventDefault()

    if (!draggedTab || draggedTab === targetTabId) {
      setDraggedTab(null)
      setDragOverTab(null)
      return
    }

    // Reorder the tabs
    const updatedTabs = [...tabs]
    const draggedTabIndex = updatedTabs.findIndex(
      (tab) => tab.id === draggedTab
    )
    const targetTabIndex = updatedTabs.findIndex(
      (tab) => tab.id === targetTabId
    )

    if (draggedTabIndex !== -1 && targetTabIndex !== -1) {
      // Don't allow reordering the Summary tab
      if (draggedTabIndex === 0 || targetTabIndex === 0) {
        setDraggedTab(null)
        setDragOverTab(null)
        return
      }

      const [draggedTabItem] = updatedTabs.splice(draggedTabIndex, 1)
      updatedTabs.splice(targetTabIndex, 0, draggedTabItem)

      setTabs(updatedTabs)
    }

    setDraggedTab(null)
    setDragOverTab(null)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="summary"
      >
        <div className="flex items-center border-b">
          {/* Custom TabsList that doesn't use shadcn's TabsList for more control */}
          <div className="flex h-10 items-center justify-start bg-muted text-muted-foreground rounded-md p-1 w-full">
            {/* Fixed Summary Tab */}
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                activeTab === "summary"
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </button>

            {/* Scrollable area for other tabs */}
            {formatTabs.length > 0 && (
              <div
                className="overflow-x-auto flex-grow mx-1 scrollbar-hide"
                ref={scrollContainerRef}
              >
                <div className="flex">
                  {formatTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={cn(
                        "flex items-center",
                        draggedTab === tab.id && "opacity-50",
                        dragOverTab === tab.id && "border-l-2 border-primary"
                      )}
                      draggable
                      onDragStart={(e) => handleDragStart(e, tab.id)}
                      onDragOver={(e) => handleDragOver(e, tab.id)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, tab.id)}
                    >
                      <button
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative ${
                          activeTab === tab.id
                            ? "bg-background text-foreground shadow-sm"
                            : "hover:bg-background/50"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span className="flex items-center">
                          <GripVertical className="h-3 w-3 mr-1 cursor-grab" />
                          {tab.label}
                        </span>
                        {tab.removable && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 absolute -top-2 -right-2 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeTab(tab.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove tab</span>
                          </Button>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add tab</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableOptions.map((option) => (
                <DropdownMenuItem key={option} onClick={() => addTab(option)}>
                  {option} CP
                </DropdownMenuItem>
              ))}
              <Dialog
                open={isCustomModalOpen}
                onOpenChange={setIsCustomModalOpen}
              >
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setIsCustomModalOpen(true)
                    }}
                  >
                    Custom...
                  </DropdownMenuItem>
                </DialogTrigger>
                <CustomFormatDialog addCustomTab={addCustomTab} />
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tab contents */}
        <TabsContent values={["summary"]}>
          <SummaryContent />
        </TabsContent>

        {/* Single TabsContent for all non-summary tabs */}
        {formatTabs.length > 0 && (
          <TabsContent
            values={formatTabs.map((tab) => {
              return tab.format.id
            })}
          >
            {activeTab !== "summary" && (
              <TabContentView
                value={tabs.find((tab) => tab.id === activeTab)?.value || ""}
                label={tabs.find((tab) => tab.id === activeTab)?.label || ""}
              />
            )}
          </TabsContent>
        )}
      </Tabs>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  )
}
