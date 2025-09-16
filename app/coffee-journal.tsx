'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.15
      }
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      y: -30,
      opacity: 0
    }
  }

  const cardVariants = {
    hidden: { scale: 0.8, y: 50, opacity: 0 },
    visible: {
      scale: 1,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 400
      }
    },
    tap: {
      scale: 0.95
    }
  }

  const heroVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  }

  // Kaffee hinzufügen mit neuer Datenstruktur
  const addCoffee = () => {
    const { name, roastery, coffeeType, rating, notes } = formData

    if (name.trim() && rating.taste && rating.aroma && rating.aftertaste && rating.overall) {
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
      {/* Animated Header */}
      <motion.div
          className="bg-white backdrop-blur-sm border-b border-stone-200/60 sticky top-0 z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setCurrentView('menu')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center"
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <span className="text-xl">☕</span>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                  KaffeeMomente
                </h1>
                <p className="text-sm text-stone-500">Kaffee erleben, bewerten und weitergeben</p>
              </div>
            </motion.button>

            <div className="flex items-center space-x-3">
              <AnimatePresence>
                {currentView !== 'menu' && (
                  <motion.button
                    onClick={() => setCurrentView('menu')}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0V11a1 1 0 011-1h2a1 1 0 011 1v10m0 0V11h3a1 1 0 001-1V5a1 1 0 00-1-1H9a1 1 0 00-1 1v6" />
                    </svg>
                    <span>Home</span>
                  </motion.button>
                )}
              </AnimatePresence>
              <motion.div
                className="hidden sm:flex items-center space-x-2 text-sm text-stone-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="px-3 py-1 bg-stone-100 rounded-full">
                  {coffees.length} Kaffees entdeckt
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content mit AnimatePresence für smooth transitions */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Menü */}
          {currentView === 'menu' && (
            <motion.div
              key="menu"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {/* Hero Section */}
              <motion.div
                variants={heroVariants}
                className="text-center space-y-4 py-8"
              >
                <h2 className="text-4xl font-bold text-stone-800 mb-2">
                  Finde deinen Lieblingskaffee
                </h2>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                  Entdecke neue Röstungen, bewerte Geschmack und Aroma
                  und teile deine Erfahrungen mit anderen Kaffeeliebhabern.
                </p>
              </motion.div>

              {/* Action Cards */}
              <motion.div
                variants={itemVariants}
                className="grid md:grid-cols-2 gap-6"
              >
                <motion.button
                  onClick={() => setCurrentView('add')}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="group relative p-8 rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
                  style={{
                    backgroundImage: 'url(/coffee-background.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                 {/* Dunkler Overlay für bessere Textlesbarkeit */}
                 <div className="absolute inset-0 bg-black/40 rounded-2xl" />

                 <div className="flex items-start space-x-4 relative z-10">
                   <div className="flex-1 text-left">
                     <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">Neuer Kaffee, neuer Moment</h3>
                     <p className="text-gray-100 drop-shadow-md">Bewerte Geschmack, Aroma, Nachgeschmack und Gesamteindruck</p>
                   </div>
                 </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-600/5 rounded-2xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>

                <motion.button
                  onClick={() => setCurrentView('show')}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="group relative p-8 bg-white rounded-2xl border border-stone-200 shadow-sm transition-shadow duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center"
                      whileHover={{ rotate: -5, scale: 1.1 }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </motion.div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-semibold text-stone-800 mb-2">Deine Reviews</h3>
                      <p className="text-stone-600">{coffees.length} detaillierte Kaffee-Bewertungen durchstöbern</p>
                    </div>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-600/5 rounded-2xl"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              </motion.div>

              {/* Quick Stats mit staggered animation */}
              {coffees.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-stone-200"
                >
                  <h3 className="text-lg font-semibold text-stone-800 mb-4">Deine Kaffee-Statistiken</h3>
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    variants={containerVariants}
                  >
                    {[
                      { value: coffees.length, label: 'Kaffees bewertet', color: 'emerald' },
                      {
                        value: coffees.length > 0 ? Math.round((coffees.reduce((sum, coffee) => sum + coffee.averageRating, 0) / coffees.length) * 10) / 10 : 0,
                        label: 'Ø Gesamtbewertung',
                        color: 'blue'
                      },
                      {
                        value: coffees.filter(coffee => coffee.averageRating >= 8).length,
                        label: 'Premium Kaffees (8+)',
                        color: 'amber'
                      },
                      {
                        value: new Set(coffees.map(coffee => coffee.roastery)).size,
                        label: 'Röstereien entdeckt',
                        color: 'purple'
                      }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          className={`text-2xl font-bold text-${stat.color}-600`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: index * 0.1 + 0.5,
                            type: "spring",
                            damping: 20
                          }}
                        >
                          {stat.value}
                        </motion.div>
                        <div className="text-sm text-stone-600">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Kaffee hinzufügen - Animated Form */}
          {currentView === 'add' && (
           <motion.div
             key="add"
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -50 }}
             transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
             className="max-w-3xl mx-auto relative"

           >
             {/* Semi-transparent overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl" />
            <motion.div
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-stone-200/50 overflow-hidden relative z-10"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white">Detaillierte Kaffee-Bewertung</h2>
                  <p className="text-emerald-100 mt-1">Bewerte alle Aspekte für die Community</p>
                </div>

                <div className="p-8 space-y-6">
                  {/* Basis-Informationen */}
                  <motion.div
                    className="grid md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div>
                      <label className="block text-sm font-semibold text-stone-800 mb-3">
                        Kaffee-Name *
                      </label>
                      <motion.input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 placeholder-stone-500"
                        placeholder="z.B. Ethiopian Yirgacheffe"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", damping: 20 }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-800 mb-3">
                        Rösterei (optional)
                      </label>
                      <motion.input
                        type="text"
                        value={formData.roastery}
                        onChange={(e) => handleInputChange('roastery', e.target.value)}
                        className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 placeholder-stone-500"
                        placeholder="z.B. Rösterei Müller (optional)"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", damping: 20 }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-stone-800 mb-3">
                      Kaffee-Typ
                    </label>
                    <motion.select
                      value={formData.coffeeType}
                      onChange={(e) => handleInputChange('coffeeType', e.target.value)}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 bg-white"
                      whileFocus={{ scale: 1.02 }}
                    >
                      {Object.entries(coffeeTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </motion.select>
                  </motion.div>

                  {/* Detaillierte Bewertungen */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold text-stone-800 mb-4">Detaillierte Bewertung</h3>
                    <motion.div
                      className="grid md:grid-cols-2 gap-6"
                      variants={containerVariants}
                    >
                      {[
                        { key: 'taste', label: 'Geschmack' },
                        { key: 'aroma', label: 'Aroma/Geruch' },
                        { key: 'aftertaste', label: 'Nachgeschmack' },
                        { key: 'overall', label: 'Gesamteindruck' }
                      ].map((field, index) => (
                        <motion.div
                          key={field.key}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.1 * index }}
                        >
                          <label className="block text-sm font-semibold text-stone-800 mb-3">
                            {field.label} * (1-10)
                          </label>
                          <motion.input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.rating[field.key as keyof AddCoffeeFormData['rating']]}
                            onChange={(e) => handleRatingChange(field.key as keyof AddCoffeeFormData['rating'], e.target.value)}
                            className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-stone-900 placeholder-stone-500"
                            placeholder="1-10"
                            whileFocus={{ scale: 1.02 }}
                            transition={{ type: "spring", damping: 20 }}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Notizen */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-semibold text-stone-800 mb-3">
                      Persönliche Notizen (optional)
                    </label>
                    <motion.textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none text-stone-900 placeholder-stone-500"
                      placeholder="Deine Gedanken zu diesem Kaffee..."
                      whileFocus={{ scale: 1.02 }}
                    />
                  </motion.div>

                  <motion.div
                    className="flex space-x-4 pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button
                      onClick={addCoffee}
                      disabled={!isFormValid()}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed transition-all duration-200"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      Bewertung speichern
                    </motion.button>
                    <motion.button
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
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Abbrechen
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Erweiterte Kaffee-Liste mit staggered cards */}
          {currentView === 'show' && (
            <motion.div
              key="show"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="space-y-6"
            >
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <h2 className="text-3xl font-bold text-stone-800">Deine Rösterei-Reviews</h2>
                  <p className="text-stone-600 mt-1">{coffees.length} detaillierte Bewertungen</p>
                </div>
              </motion.div>

              {coffees.length === 0 ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      damping: 20
                    }}
                  >
                    <span className="text-4xl text-stone-400">☕</span>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-2">Keine Bewertungen vorhanden</h3>
                  <p className="text-stone-600 mb-6">Starte deine Kaffee-Reise mit deiner ersten detaillierten Bewertung!</p>
                  <motion.button
                    onClick={() => setCurrentView('add')}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ersten Kaffee bewerten
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {coffees.map((coffee, index) => (
                    <motion.div
                      key={coffee.id}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                        rotateX: 5,
                        transition: { type: "spring", damping: 20, stiffness: 300 }
                      }}
                      className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        className="p-6"
                        whileHover={{ rotateX: -2 }}
                        transition={{ type: "spring", damping: 25 }}
                      >
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
                          <motion.div
                            className="ml-4"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", damping: 20 }}
                          >
                            <div className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-sm font-semibold">
                              ⌀ {coffee.averageRating}/10
                            </div>
                          </motion.div>
                        </div>

                        {/* Detaillierte Bewertungen */}
                        <motion.div
                          className="space-y-2 mb-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {[
                            { label: 'Geschmack', value: coffee.rating.taste },
                            { label: 'Aroma', value: coffee.rating.aroma },
                            { label: 'Nachgeschmack', value: coffee.rating.aftertaste },
                            { label: 'Gesamteindruck', value: coffee.rating.overall }
                          ].map((rating, ratingIndex) => (
                            <motion.div
                              key={rating.label}
                              className="flex justify-between items-center text-sm"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + ratingIndex * 0.05 }}
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-stone-600">{rating.label}</span>
                              <motion.span
                                className="font-medium text-stone-800"
                                whileHover={{ scale: 1.2 }}
                              >
                                {rating.value}/10
                              </motion.span>
                            </motion.div>
                          ))}
                        </motion.div>

                        {coffee.notes && (
                          <motion.div
                            className="mb-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <p className="text-sm text-stone-600 italic bg-stone-50 p-3 rounded-lg">
                              "{coffee.notes}"
                            </p>
                          </motion.div>
                        )}

                        <motion.div
                          className="flex items-center justify-between pt-4 border-t border-stone-100"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="text-sm text-stone-500">
                            {coffee.dateAdded.toLocaleDateString('de-DE', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                          <motion.div
                            className="flex"
                            whileHover="hover"
                            variants={{
                              hover: {
                                transition: {
                                  staggerChildren: 0.1
                                }
                              }
                            }}
                          >
                            {[...Array(5)].map((_, i) => (
                              <motion.span
                                key={i}
                                className={`text-lg ${
                                  i < Math.round(coffee.averageRating / 2) ? 'text-amber-400' : 'text-stone-200'
                                }`}
                                variants={{
                                  hover: { scale: 1.3, rotate: 10 }
                                }}
                                transition={{ type: "spring", damping: 20 }}
                              >
                                ★
                              </motion.span>
                            ))}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}