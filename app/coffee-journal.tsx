'use client'

import { useState, useEffect } from 'react'
import { Coffee, ViewState, AddCoffeeFormData } from '../types/coffee'
import { storageUtils, generateCoffeeId, calculateAverageRating } from '../lib/storage'

export default function CoffeeJournal() {
  // State mit neuen Types
  const [coffees, setCoffees] = useState<Coffee[]>([])
  const [currentView, setCurrentView] = useState<ViewState>('menu')
  const [formData, setFormData] = useState<AddCoffeeFormData>({
    name: '',
    roastery: '',
    coffeeType: 'other',
    rating: {
      taste: '',
      aroma: '',
      aftertaste: '',
      overall: ''
    },
    notes: ''
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
    const { name, roastery, coffeeType, rating, notes } = formData

   if (name.trim() && rating.taste && rating.aroma && rating.aftertaste && rating.overall)  {
      const numericRating = {
        taste: parseInt(rating.taste),
        aroma: parseInt(rating.aroma),
        aftertaste: parseInt(rating.aftertaste),
        overall: parseInt(rating.overall)
      }

      // Validate ratings
      const isValidRating = Object.values(numericRating).every(r => r >= 1 && r <= 10)

      if (isValidRating) {
        const newCoffee: Coffee = {
          id: generateCoffeeId(),
          name: name.trim(),
          roastery: roastery.trim() || 'Unbekannte Rösterei',
          coffeeType: coffeeType,
          rating: numericRating,
          averageRating: calculateAverageRating(numericRating),
          notes: notes.trim(),
          dateAdded: new Date()
        }

        setCoffees(prev => [...prev, newCoffee])
        setFormData({
          name: '',
          roastery: '',
          coffeeType: 'other',
          rating: {
            taste: '',
            aroma: '',
            aftertaste: '',
            overall: ''
          },
          notes: ''
        })
        setCurrentView('menu')
      }
    }
  }

  // Formular-Handler
  const handleInputChange = (field: keyof AddCoffeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRatingChange = (criterion: keyof AddCoffeeFormData['rating'], value: string) => {
    setFormData(prev => ({
      ...prev,
      rating: { ...prev.rating, [criterion]: value }
    }))
  }

  const coffeeTypeLabels = {
    espresso: 'Espresso',
    cappuccino: 'Cappuccino',
    latte: 'Latte Macchiato',
    americano: 'Americano',
    filter: 'Filterkaffee',
    'french-press': 'French Press',
    'cold-brew': 'Cold Brew',
    other: 'Sonstige'
  }

  const isFormValid = () => {
return formData.name.trim() &&
       formData.rating.taste &&
           formData.rating.aroma &&
           formData.rating.aftertaste &&
           formData.rating.overall
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-neutral-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-stone-200/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView('menu')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">☕</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                  KaffeeMomente
                </h1>
                <p className="text-sm text-stone-500">Kaffee erleben, bewerten und weitergeben</p>
              </div>
            </button>

            <div className="flex items-center space-x-3">
              {currentView !== 'menu' && (
                <button
                  onClick={() => setCurrentView('menu')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0V11a1 1 0 011-1h2a1 1 0 011 1v10m0 0V11h3a1 1 0 001-1V5a1 1 0 00-1-1H9a1 1 0 00-1 1v6" />
                  </svg>
                  <span>Home</span>
                </button>
              )}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-stone-600">
                <span className="px-3 py-1 bg-stone-100 rounded-full">
                  {coffees.length} Kaffees entdeckt
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Menü */}
        {currentView === 'menu' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h2 className="text-4xl font-bold text-stone-800 mb-2">
                Finde deinen Lieblingskaffee
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                Entdecke neue Röstungen, bewerte Geschmack und Aroma
                und teile deine Erfahrungen mit anderen Kaffeeliebhabern.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setCurrentView('add')}
                className="group relative p-8 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-semibold text-stone-800 mb-2">Neuer Kaffee, neuer Moment</h3>
                    <p className="text-stone-600">Bewerte Geschmack, Aroma, Nachgeschmack und Gesamteindruck</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => setCurrentView('show')}
                className="group relative p-8 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-semibold text-stone-800 mb-2">Deine Reviews</h3>
                    <p className="text-stone-600">{coffees.length} detaillierte Kaffee-Bewertungen durchstöbern</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Quick Stats */}
            {coffees.length > 0 && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200">
                <h3 className="text-lg font-semibold text-stone-800 mb-4">Deine Kaffee-Statistiken</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{coffees.length}</div>
                    <div className="text-sm text-stone-600">Kaffees bewertet</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {coffees.length > 0 ? Math.round((coffees.reduce((sum, coffee) => sum + coffee.averageRating, 0) / coffees.length) * 10) / 10 : 0}
                    </div>
                    <div className="text-sm text-stone-600">Ø Gesamtbewertung</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {coffees.filter(coffee => coffee.averageRating >= 8).length}
                    </div>
                    <div className="text-sm text-stone-600">Premium Kaffees (8+)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {new Set(coffees.map(coffee => coffee.roastery)).size}
                    </div>
                    <div className="text-sm text-stone-600">Röstereien entdeckt</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kaffee hinzufügen - Erweiterte Version */}
        {currentView === 'add' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">Detaillierte Kaffee-Bewertung</h2>
                <p className="text-emerald-100 mt-1">Bewerte alle Aspekte für die Community</p>
              </div>

              <div className="p-8 space-y-6">
                {/* Basis-Informationen */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-3">
                      Kaffee-Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 placeholder-stone-500"
                      placeholder="z.B. Ethiopian Yirgacheffe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-3">
                      Rösterei (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.roastery}
                      onChange={(e) => handleInputChange('roastery', e.target.value)}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 placeholder-stone-500"
                      placeholder="z.B. Rösterei Müller (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-3">
                    Kaffee-Typ
                  </label>
                  <select
                    value={formData.coffeeType}
                    onChange={(e) => handleInputChange('coffeeType', e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 bg-white"
                  >
                    {Object.entries(coffeeTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Detaillierte Bewertungen */}
                <div>
                  <h3 className="text-lg font-semibold text-stone-800 mb-4">Detaillierte Bewertung</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-stone-800 mb-3">
                        Geschmack * (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.rating.taste}
                        onChange={(e) => handleRatingChange('taste', e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 placeholder-stone-500"
                        placeholder="1-10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-800 mb-3">
                        Aroma/Geruch * (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.rating.aroma}
                        onChange={(e) => handleRatingChange('aroma', e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 placeholder-stone-500"
                        placeholder="1-10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-800 mb-3">
                        Nachgeschmack * (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.rating.aftertaste}
                        onChange={(e) => handleRatingChange('aftertaste', e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 placeholder-stone-500"
                        placeholder="1-10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-800 mb-3">
                        Gesamteindruck * (1-10)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.rating.overall}
                        onChange={(e) => handleRatingChange('overall', e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 placeholder-stone-500"
                        placeholder="1-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Notizen */}
                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-3">
                    Persönliche Notizen (optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none text-stone-900 placeholder-stone-500"
                    placeholder="Deine Gedanken zu diesem Kaffee..."
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={addCoffee}
                    disabled={!isFormValid()}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Bewertung speichern
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('menu')
                      setFormData({
                        name: '',
                        roastery: '',
                        coffeeType: 'other',
                        rating: { taste: '', aroma: '', aftertaste: '', overall: '' },
                        notes: ''
                      })
                    }}
                    className="px-6 py-3 border border-stone-300 text-stone-700 rounded-xl font-semibold hover:bg-stone-50 transition-all duration-200"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Erweiterte Kaffee-Liste */}
        {currentView === 'show' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-stone-800">Deine Rösterei-Reviews</h2>
                <p className="text-stone-600 mt-1">{coffees.length} detaillierte Bewertungen</p>
              </div>
            </div>

            {coffees.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-stone-400">☕</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-2">Keine Bewertungen vorhanden</h3>
                <p className="text-stone-600 mb-6">Starte deine Kaffee-Reise mit deiner ersten detaillierten Bewertung!</p>
                <button
                  onClick={() => setCurrentView('add')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all"
                >
                  Ersten Kaffee bewerten
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coffees.map((coffee, index) => (
                  <div key={coffee.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-200">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-stone-800 line-clamp-2 mb-1">
                            {coffee.name}
                          </h3>
                          <p className="text-sm text-emerald-600 font-medium">
                            {coffee.roastery}
                          </p>
                          <p className="text-xs text-stone-500 mt-1">
                            {coffeeTypeLabels[coffee.coffeeType]}
                          </p>
                        </div>
                        <div className="ml-4">
                          <div className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-sm font-semibold">
                            ⌀ {coffee.averageRating}/10
                          </div>
                        </div>
                      </div>

                      {/* Detaillierte Bewertungen */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-stone-600">Geschmack</span>
                          <span className="font-medium text-stone-800">{coffee.rating.taste}/10</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-stone-600">Aroma</span>
                          <span className="font-medium text-stone-800">{coffee.rating.aroma}/10</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-stone-600">Nachgeschmack</span>
                          <span className="font-medium text-stone-800">{coffee.rating.aftertaste}/10</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-stone-600">Gesamteindruck</span>
                          <span className="font-medium text-stone-800">{coffee.rating.overall}/10</span>
                        </div>
                      </div>

                      {coffee.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-stone-600 italic bg-stone-50 p-3 rounded-lg">
                            "{coffee.notes}"
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                        <div className="text-sm text-stone-500">
                          {coffee.dateAdded.toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-lg ${
                              i < Math.round(coffee.averageRating / 2) ? 'text-amber-400' : 'text-stone-200'
                            }`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}