'use client'

import { useState } from 'react'

export default function CoffeeJournal() {
  // Deine Java Arrays werden zu React useState
  const [kaffeeNamen, setKaffeeNamen] = useState<string[]>([])
  const [bewertungen, setBewertungen] = useState<number[]>([])
  const [anzahlKaffees, setAnzahlKaffees] = useState(0)

  // Für das Formular
  const [neuerKaffee, setNeuerKaffee] = useState('')
  const [neueBewertung, setNeueBewertung] = useState('')
  const [aktuelleAnsicht, setAktuelleAnsicht] = useState<'menu' | 'add' | 'show'>('menu')

  // Kaffee hinzufügen (deine case 1 Logik)
  const kaffeeHinzufuegen = () => {
    if (neuerKaffee && neueBewertung && anzahlKaffees < 10) {
      const bewertung = parseInt(neueBewertung)
      if (bewertung >= 1 && bewertung <= 10) {
        setKaffeeNamen([...kaffeeNamen, neuerKaffee])
        setBewertungen([...bewertungen, bewertung])
        setAnzahlKaffees(anzahlKaffees + 1)

        // Felder zurücksetzen
        setNeuerKaffee('')
        setNeueBewertung('')
        setAktuelleAnsicht('menu')
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-amber-800">
        ☕ Coffee Journal ☕
      </h1>

      {/* Menü (deine while-Schleife mit switch) */}
      {aktuelleAnsicht === 'menu' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">== Menü ==</h2>
          <button
            onClick={() => setAktuelleAnsicht('add')}
            className="w-full p-3 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            1. Kaffee hinzufügen
          </button>
          <button
            onClick={() => setAktuelleAnsicht('show')}
            className="w-full p-3 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            2. Alle anzeigen
          </button>
        </div>
      )}

      {/* Kaffee hinzufügen (deine case 1) */}
      {aktuelleAnsicht === 'add' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Kaffee hinzufügen</h2>

          <div>
            <label className="block mb-2">Lieblingskaffee:</label>
            <input
              type="text"
              value={neuerKaffee}
              onChange={(e) => setNeuerKaffee(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Geben Sie ihren Lieblingskaffee ein"
            />
          </div>

          <div>
            <label className="block mb-2">Bewertung (1-10):</label>
            <input
              type="number"
              min="1"
              max="10"
              value={neueBewertung}
              onChange={(e) => setNeueBewertung(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="1-10 Sterne"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={kaffeeHinzufuegen}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Speichern
            </button>
            <button
              onClick={() => setAktuelleAnsicht('menu')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Zurück
            </button>
          </div>
        </div>
      )}

      {/* Alle anzeigen (deine case 2) */}
      {aktuelleAnsicht === 'show' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">=== Deine Lieblingssorten Kaffee ===</h2>

          {anzahlKaffees === 0 ? (
            <p className="text-gray-500">Noch keine Kaffees hinzugefügt.</p>
          ) : (
            <div className="space-y-2">
              {kaffeeNamen.map((kaffee, index) => (
                <div key={index} className="p-3 bg-amber-50 rounded border">
                  {index + 1}. {kaffee} - {bewertungen[index]}/10 Sterne
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setAktuelleAnsicht('menu')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Zurück zum Menü
          </button>
        </div>
      )}
    </div>
  )
}