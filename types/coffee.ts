export interface CoffeeRating {
  taste: number      // Geschmack 1-10
  aroma: number      // Geruch/Aroma 1-10
  aftertaste: number // Nachgeschmack 1-10
  overall: number    // Gesamteindruck 1-10
}

export interface CoffeeImages {
  packagePhoto?: string  // Base64 encoded image of coffee package/beans
  resultPhoto?: string   // Base64 encoded image of prepared coffee
}

export interface Coffee {
  id: string
  name: string
  roastery?: string  // Now optional
  coffeeType: 'espresso' | 'cappuccino' | 'latte' | 'americano' | 'filter' | 'french-press' | 'cold-brew' | 'other'
  rating: CoffeeRating
  averageRating: number // Berechnet aus den 4 Einzelbewertungen
  notes?: string
  images?: CoffeeImages  // Optional images
  dateAdded: Date
}

export type ViewState = 'menu' | 'add' | 'show'

export interface CoffeeJournalState {
  coffees: Coffee[]
  currentView: ViewState
}

export interface AddCoffeeFormData {
  name: string
  roastery: string  // In form it's still string, will be made optional in processing
  coffeeType: Coffee['coffeeType']
  rating: {
    taste: string
    aroma: string
    aftertaste: string
    overall: string
  }
  notes: string
  images: {
    packagePhoto?: string
    resultPhoto?: string
  }
}