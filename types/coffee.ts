export interface Coffee {
  id: string
  name: string
  rating: number
  dateAdded: Date
}

export type ViewState = 'menu' | 'add' | 'show'

export interface CoffeeJournalState {
  coffees: Coffee[]
  currentView: ViewState
}

export interface AddCoffeeFormData {
  name: string
  rating: string
}