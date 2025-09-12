import { Coffee, CoffeeRating } from '../types/coffee'

const STORAGE_KEY = 'coffee-journal-data'
const VERSION_KEY = 'coffee-journal-version'

interface LegacyCoffee {
  id?: string
  name: string
  rating: number
  dateAdded: Date | string
}

const migrateLegacyData = (legacyData: any[]): Coffee[] => {
  return legacyData.map((item: any, index: number) => {
    // Handle old format with separate arrays
    if (typeof item === 'string') {
      return {
        id: generateCoffeeId(),
        name: item,
        roastery: 'Unbekannte Rösterei',
        coffeeType: 'other' as const,
        rating: {
          taste: 7,
          aroma: 7,
          aftertaste: 7,
          overall: 7
        },
        averageRating: 7,
        notes: '',
        dateAdded: new Date()
      }
    }

    // Handle old Coffee format with single rating
    const legacyCoffee = item as LegacyCoffee
    const oldRating = legacyCoffee.rating || 7

    return {
      id: legacyCoffee.id || generateCoffeeId(),
      name: legacyCoffee.name || `Kaffee ${index + 1}`,
      roastery: 'Unbekannte Rösterei',
      coffeeType: 'other' as const,
      rating: {
        taste: oldRating,
        aroma: oldRating,
        aftertaste: oldRating,
        overall: oldRating
      },
      averageRating: oldRating,
      notes: '',
      dateAdded: new Date(legacyCoffee.dateAdded || new Date())
    }
  })
}

const calculateAverageRating = (rating: CoffeeRating): number => {
  return Math.round(((rating.taste + rating.aroma + rating.aftertaste + rating.overall) / 4) * 10) / 10
}

export const storageUtils = {
  saveCoffees: (coffees: Coffee[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coffees))
      localStorage.setItem(VERSION_KEY, '2.0')
    } catch (error) {
      console.error('Error saving coffees to localStorage:', error)
    }
  },

  loadCoffees: (): Coffee[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const version = localStorage.getItem(VERSION_KEY)

      if (!stored) return []

      const parsed = JSON.parse(stored)

      // Check if migration is needed
      if (!version || version < '2.0') {
        console.log('Migrating legacy coffee data...')
        const migrated = migrateLegacyData(parsed)
        storageUtils.saveCoffees(migrated)
        return migrated
      }

      // Convert date strings back to Date objects
      return parsed.map((coffee: any) => ({
        ...coffee,
        dateAdded: new Date(coffee.dateAdded)
      }))
    } catch (error) {
      console.error('Error loading coffees from localStorage:', error)
      return []
    }
  },

  clearCoffees: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(VERSION_KEY)
    } catch (error) {
      console.error('Error clearing coffees from localStorage:', error)
    }
  }
}

export const generateCoffeeId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const createCoffeeRating = (taste: number, aroma: number, aftertaste: number, overall: number): CoffeeRating => {
  return { taste, aroma, aftertaste, overall }
}

export { calculateAverageRating }