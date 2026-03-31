import { useState } from 'react'
import './App.css'

const ATTRACTIONS = {
  Tokyo: [
    { id: 1, name: 'Tokyo Tower', description: 'Iconic red communications tower' },
    { id: 2, name: 'Senso-ji Temple', description: 'Ancient Buddhist temple in Asakusa' },
    { id: 3, name: 'Shibuya Crossing', description: 'World-famous pedestrian crossing' },
    { id: 4, name: 'Meiji Shrine', description: 'Shinto shrine in a forest setting' },
    { id: 5, name: 'Tsukiji Market', description: 'Famous fish market' },
  ],
  Paris: [
    { id: 1, name: 'Eiffel Tower', description: 'Iconic iron lattice tower' },
    { id: 2, name: 'Louvre Museum', description: 'World\'s largest art museum' },
    { id: 3, name: 'Notre-Dame', description: 'Medieval Catholic cathedral' },
    { id: 4, name: 'Champs-Élysées', description: 'Famous shopping boulevard' },
    { id: 5, name: 'Montmartre', description: 'Historic artists\' neighborhood' },
  ],
  'New York': [
    { id: 1, name: 'Statue of Liberty', description: 'Iconic gift from France' },
    { id: 2, name: 'Central Park', description: 'Urban park in Manhattan' },
    { id: 3, name: 'Times Square', description: 'Bright lights and Broadway' },
    { id: 4, name: 'Empire State Building', description: 'Art deco skyscraper' },
    { id: 5, name: 'Brooklyn Bridge', description: 'Historic suspension bridge' },
  ],
  London: [
    { id: 1, name: 'Big Ben', description: 'Famous clock tower' },
    { id: 2, name: 'Tower of London', description: 'Historic castle and fortress' },
    { id: 3, name: 'Buckingham Palace', description: 'Royal residence' },
    { id: 4, name: 'British Museum', description: 'World-renowned museum' },
    { id: 5, name: 'London Eye', description: 'Giant observation wheel' },
  ],
  Rome: [
    { id: 1, name: 'Colosseum', description: 'Ancient Roman amphitheater' },
    { id: 2, name: 'Vatican Museums', description: 'Art museums in Vatican' },
    { id: 3, name: 'Trevi Fountain', description: 'Baroque fountain' },
    { id: 4, name: 'Roman Forum', description: 'Ancient Roman ruins' },
    { id: 5, name: 'Pantheon', description: 'Ancient Roman temple' },
  ],
  default: [
    { id: 1, name: 'City Center', description: 'Main downtown area' },
    { id: 2, name: 'Historic Old Town', description: 'Traditional historic district' },
    { id: 3, name: 'Local Market', description: 'Fresh produce and crafts' },
    { id: 4, name: 'Central Park', description: 'Beautiful city park' },
    { id: 5, name: 'Museum District', description: 'Cultural attractions' },
  ],
}

const CITIES = ['Tokyo', 'Paris', 'New York', 'London', 'Rome']

function StepIndicator({ currentStep }) {
  const steps = ['City', 'Attractions', 'Route']
  return (
    <div className="step-indicator">
      {steps.map((label, index) => (
        <div key={index} className={`step ${index + 1 <= currentStep ? 'active' : ''}`}>
          <span className="step-number">{index + 1}</span>
          <span className="step-label">{label}</span>
        </div>
      ))}
    </div>
  )
}

function CitySelection({ onNext }) {
  const [city, setCity] = useState('')
  const [customCity, setCustomCity] = useState('')
  const [days, setDays] = useState(3)

  const handleSubmit = () => {
    const selectedCity = city || customCity
    if (selectedCity && days >= 1 && days <= 30) {
      onNext(selectedCity, parseInt(days))
    }
  }

  const isValid = (city || customCity) && days >= 1 && days <= 30

  return (
    <div className="page">
      <h2>Plan Your Trip</h2>
      <div className="form-group">
        <label>Select a City</label>
        <select value={city} onChange={(e) => { setCity(e.target.value); setCustomCity(''); }}>
          <option value="">-- Choose a city --</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Or enter your own city</label>
        <input
          type="text"
          placeholder="Enter city name"
          value={customCity}
          onChange={(e) => { setCustomCity(e.target.value); setCity(''); }}
        />
      </div>
      <div className="form-group">
        <label>Number of Days: {days}</label>
        <input
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
      </div>
      <button className="btn-primary" onClick={handleSubmit} disabled={!isValid}>
        Next
      </button>
    </div>
  )
}

function AttractionSelection({ city, days, onNext, onBack }) {
  const [selected, setSelected] = useState([])

  const attractions = ATTRACTIONS[city] || ATTRACTIONS.default

  const toggleAttraction = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    const selectedAttractions = attractions.filter((a) => selected.includes(a.id))
    onNext(selectedAttractions)
  }

  return (
    <div className="page">
      <h2>Select Attractions</h2>
      <p className="subtitle">{city} - {days} days</p>
      <div className="attraction-list">
        {attractions.map((attraction) => (
          <label key={attraction.id} className={`attraction-item ${selected.includes(attraction.id) ? 'selected' : ''}`}>
            <input
              type="checkbox"
              checked={selected.includes(attraction.id)}
              onChange={() => toggleAttraction(attraction.id)}
            />
            <div className="attraction-info">
              <span className="attraction-name">{attraction.name}</span>
              <span className="attraction-desc">{attraction.description}</span>
            </div>
          </label>
        ))}
      </div>
      <div className="button-row">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={selected.length === 0}>
          Generate Route
        </button>
      </div>
    </div>
  )
}

function RouteResult({ city, days, attractions, onStartOver, onBack }) {
  const groupByDays = () => {
    const result = []
    const attractionsPerDay = Math.ceil(attractions.length / days)
    
    for (let i = 0; i < days; i++) {
      const start = i * attractionsPerDay
      const end = Math.min(start + attractionsPerDay, attractions.length)
      const dayAttractions = attractions.slice(start, end)
      result.push({ day: i + 1, attractions: dayAttractions })
    }
    return result
  }

  const routeByDays = groupByDays()

  return (
    <div className="page">
      <h2>Your Route</h2>
      <p className="subtitle">{city} - {days} day{days > 1 ? 's' : ''}</p>
      <div className="route-list">
        {attractions.length === 0 ? (
          <p className="no-attractions">No attractions selected</p>
        ) : (
          routeByDays.map(({ day, attractions: dayAttractions }) => (
            <div key={day} className="day-group">
              <div className="day-header">Day {day}</div>
              {dayAttractions.length === 0 ? (
                <div className="route-item rest-day">
                  <span className="route-bullet">•</span>
                  <span className="route-name">Rest Day</span>
                </div>
              ) : (
                dayAttractions.map((attraction, index) => (
                  <div key={index} className="route-item">
                    <span className="route-bullet">•</span>
                    <span className="route-name">{attraction.name}</span>
                  </div>
                ))
              )}
            </div>
          ))
        )}
      </div>
      <div className="button-row">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={onStartOver}>Start Over</button>
      </div>
    </div>
  )
}

function App() {
  const [step, setStep] = useState(1)
  const [city, setCity] = useState('')
  const [days, setDays] = useState(3)
  const [selectedAttractions, setSelectedAttractions] = useState([])

  const handleCityNext = (selectedCity, selectedDays) => {
    setCity(selectedCity)
    setDays(selectedDays)
    setSelectedAttractions([])
    setStep(2)
  }

  const handleAttractionNext = (attractions) => {
    setSelectedAttractions(attractions)
    setStep(3)
  }

  const handleStartOver = () => {
    setStep(1)
    setCity('')
    setDays(3)
    setSelectedAttractions([])
  }

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1))
  }

  return (
    <div className="app">
      <div className="card">
        <StepIndicator currentStep={step} />
        {step === 1 && <CitySelection onNext={handleCityNext} />}
        {step === 2 && (
          <AttractionSelection
            city={city}
            days={days}
            onNext={handleAttractionNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <RouteResult
            city={city}
            days={days}
            attractions={selectedAttractions}
            onStartOver={handleStartOver}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}

export default App
