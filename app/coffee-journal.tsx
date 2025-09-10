'use client'

import { useState, useEffect } from 'react'
import { Coffee, ViewState, AddCoffeeFormData } from '../types/coffee'
import { storageUtils, generateCoffeeId } from '../lib/storage'

export default function CoffeeJournal() {
  // State mit neuen Types
  const [coffees, setCoffees] = useState<Coffee[]>([])
  const [currentView, setCurrentView] = useState<ViewState>('menu')
  const [formData, setFormData] = useState<AddCoffeeFormData>({
    name: '',
    rating: ''
  })

  // Daten beim Start laden
  useEffect(() => {
    const loadedCoffees = storageUtils.loadCoffees()
    setCoffees(loadedCoffees)
  }, [])

  // Daten speichern bei Änderungen
  useEffect(() => {
    if (coffees.length > 0) {
      storageUtils.saveCoffees(coffees)
    }
  }, [coffees])

  // Kaffee hinzufügen mit neuer Datenstruktur
  const addCoffee = () => {
    if (formData.name.trim() && formData.rating && coffees.length < 10) {
      const rating = parseInt(formData.rating)
      if (rating >= 1 && rating <= 10) {
        const newCoffee: Coffee = {
          id: generateCoffeeId(),
          name: formData.name.trim(),
          rating: rating,
          dateAdded: new Date()
        }

        setCoffees(prev => [...prev, newCoffee])
        setFormData({ name: '', rating: '' })
        setCurrentView('menu')
      }
    }
  }

  // Formular-Handler
  const handleInputChange = (field: keyof AddCoffeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-amber-800">
        ☕ Coffee Journal ☕
      </h1>

      {/* Menü */}
      {currentView === 'menu' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">== Menü ==</h2>
          <button
            onClick={() => setCurrentView('add')}
            className="w-full p-3 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            1. Kaffee hinzufügen
          </button>
          <button
            onClick={() => setCurrentView('show')}
            className="w-full p-3 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            2. Alle anzeigen ({coffees.length} Kaffees)
          </button>
        </div>
      )}

      {/* Kaffee hinzufügen */}
      {currentView === 'add' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Kaffee hinzufügen</h2>

          <div>
            <label className="block mb-2 font-medium">Lieblingskaffee:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="Geben Sie ihren Lieblingskaffee ein"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Bewertung (1-10):</label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              placeholder="1-10 Sterne"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={addCoffee}
              disabled={!formData.name.trim() || !formData.rating}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Speichern
            </button>
            <button
              onClick={() => {
                setCurrentView('menu')
                setFormData({ name: '', rating: '' })
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Zurück
            </button>
          </div>
        </div>
      )}

      {/* Alle anzeigen */}
      {currentView === 'show' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">=== Deine Lieblingssorten Kaffee ===</h2>

          {coffees.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Noch keine Kaffees hinzugefügt.</p>
          ) : (
            <div className="space-y-3">
              {coffees.map((coffee, index) => (
                <div key={coffee.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {index + 1}. {coffee.name}
                    </span>
                    <span className="text-amber-700 font-semibold">
                      {coffee.rating}/10 ⭐
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Hinzugefügt am {coffee.dateAdded.toLocaleDateString('de-DE')}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setCurrentView('menu')}
            className="w-full mt-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Zurück zum Menü
          </button>
        </div>
      )}
    </div>
  )
}