export async function fetchGameMaster(forceRefresh = false) {
    return fetchData("gamemaster", "https://raw.githubusercontent.com/pvpoke/pvpoke/refs/heads/master/src/data/gamemaster/pokemon.json", forceRefresh)
}

export async function fetchCup(cup, cp, forceRefresh = false) {
    const baseUrl = 'https://raw.githubusercontent.com/pvpoke/pvpoke/refs/heads/master/src/data'
    const url = `${baseUrl}/rankings/${cup}/overall/rankings-${cp}.json`
    return fetchData(`${cup}-${cp}`, url, forceRefresh)
}

export async function fetchData(id, url, forceRefresh = false) {
    // Check localStorage first if not forcing refresh
    if (!forceRefresh) {
        const cachedData = localStorage.getItem(id)
        if (cachedData) {
            try {
                const { data, timestamp } = JSON.parse(cachedData)
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
        const response = await fetch(
            url,
        )

        if (!response.ok) {
            throw new Error(`Failed to fetch ${id}: ${response.status}`)
        }

        const data = await response.json()

        // Store in localStorage with timestamp
        localStorage.setItem(
            id,
            JSON.stringify({
                data: data
            }),
        )

        return data
    } catch (error) {
        console.error(`Error fetching ${id}:`, error)
        throw error
    }
}