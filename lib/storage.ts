import { Coffee } from '../types/coffee'

const STORAGE_KEY = 'coffee-journal-data'

export const storageUtils = {
  saveCoffees: (coffees: Coffee[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coffees))
    } catch (error) {
      console.error('Error saving coffees to localStorage:', error)
    }
  },

  loadCoffees: (): Coffee[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []

      const parsed = JSON.parse(stored)
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
    } catch (error) {
      console.error('Error clearing coffees from localStorage:', error)
    }
  }
}

export const generateCoffeeId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}