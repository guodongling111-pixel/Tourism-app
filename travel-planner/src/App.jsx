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

const FOOD_SPOTS = {
  Tokyo: {
    Breakfast: [
      { id: 1, name: 'Blue Bottle Coffee', type: 'Cafe', area: 'Omotesando' },
      { id: 2, name: 'Komeda Coffee', type: 'Coffee Shop', area: 'Shibuya' },
      { id: 3, name: ' Lawson Store', type: 'Convenience', area: 'Various' },
    ],
    Lunch: [
      { id: 4, name: 'Ichiran Ramen', type: 'Ramen', area: 'Shibuya' },
      { id: 5, name: 'Maisen', type: 'Tonkatsu', area: 'Shibuya' },
      { id: 6, name: 'Gyukatsu Motomura', type: 'Beef Cutlet', area: 'Shibuya' },
    ],
    Dinner: [
      { id: 7, name: 'Tsukiji Sushi', type: 'Sushi', area: 'Tsukiji' },
      { id: 8, name: 'Ushiya', type: 'BBQ', area: 'Shibuya' },
      { id: 9, name: 'Gontran Cherrier', type: 'Bakery', area: 'Shibuya' },
    ],
  },
  Paris: {
    Breakfast: [
      { id: 1, name: 'Café de Flore', type: 'Coffee Shop', area: 'Saint-Germain' },
      { id: 2, name: 'Du Pain et des Idées', type: 'Bakery', area: 'Canal Saint-Martin' },
      { id: 3, name: 'La Maison Sans Gluten', type: 'Cafe', area: 'Le Marais' },
    ],
    Lunch: [
      { id: 4, name: 'Breizh Café', type: 'Crepes', area: 'Marais' },
      { id: 5, name: 'Le Comptoir du Panthéon', type: 'Bistro', area: 'Latin Quarter' },
      { id: 6, name: 'Café Martini', type: 'Bistro', area: 'Montparnasse' },
    ],
    Dinner: [
      { id: 7, name: 'L\'Ambroisie', type: 'French Fine Dining', area: 'Place Vendôme' },
      { id: 8, name: 'Le Cinq', type: 'French', area: 'George V' },
      { id: 9, name: 'Bouillon Chartier', type: 'French', area: 'Grand Boulevard' },
    ],
  },
  'New York': {
    Breakfast: [
      { id: 1, name: 'Blue Bottle Coffee', type: 'Cafe', area: 'Brooklyn' },
      { id: 2, name: 'Joe\'s Coffee', type: 'Coffee Shop', area: 'West Village' },
      { id: 3, name: 'Clinton Street Baking', type: 'Bakery', area: 'Lower East Side' },
    ],
    Lunch: [
      { id: 4, name: 'Katz\'s Delicatessen', type: 'Deli', area: 'Lower East Side' },
      { id: 5, name: 'Joe\'s Pizza', type: 'Pizza', area: 'Greenwich Village' },
      { id: 6, name: 'Shake Shack', type: 'Burger', area: 'Madison Square' },
    ],
    Dinner: [
      { id: 7, name: 'Le Bernardin', type: 'Seafood', area: 'Midtown' },
      { id: 8, name: 'Carbone', type: 'Italian', area: 'West Village' },
      { id: 9, name: 'Keens', type: 'Steakhouse', area: 'Garment District' },
    ],
  },
  London: {
    Breakfast: [
      { id: 1, name: 'Monmouth Coffee', type: 'Coffee', area: 'Borough' },
      { id: 2, name: 'The Coal Shed', type: 'Full English', area: 'Tower Bridge' },
      { id: 3, name: 'Flat Iron', type: 'Cafe', area: 'Covent Garden' },
    ],
    Lunch: [
      { id: 4, name: 'Dishoom', type: 'Indian', area: 'Covent Garden' },
      { id: 5, name: 'Borough Market', type: 'Market Food', area: 'Southwark' },
      { id: 6, name: 'Brick Lane Curry', type: 'Indian', area: 'Brick Lane' },
    ],
    Dinner: [
      { id: 7, name: 'The Ledbury', type: 'Fine Dining', area: 'Notting Hill' },
      { id: 8, name: 'The Harwood Arms', type: 'Pub', area: 'Fulham' },
      { id: 9, name: 'The Wolseley', type: 'European', area: 'Piccadilly' },
    ],
  },
  Rome: {
    Breakfast: [
      { id: 1, name: 'Sant\'Eustachio Il Caffè', type: 'Coffee', area: 'Piazza di Sant\'Eustachio' },
      { id: 2, name: 'Roscioli', type: 'Cafe', area: 'Campo de\' Fiori' },
      { id: 3, name: 'Piazza Madonna', type: 'Bar', area: 'Centro Storico' },
    ],
    Lunch: [
      { id: 4, name: 'Pizzarium', type: 'Pizza al Taglio', area: 'Trastevere' },
      { id: 5, name: 'Da Enzo al 29', type: 'Trattoria', area: 'Trastevere' },
      { id: 6, name: 'Roscioli Salumeria', type: 'Cured Meats', area: 'Campo de\' Fiori' },
    ],
    Dinner: [
      { id: 7, name: 'Il Pagliaccio', type: 'Fine Dining', area: 'Centro Storico' },
      { id: 8, name: 'Trattoria da Danilo', type: 'Trattoria', area: 'Testaccio' },
      { id: 9, name: 'Giolitti', type: 'Gelato', area: 'Centro Storico' },
    ],
  },
  default: {
    Breakfast: [
      { id: 1, name: 'Corner Cafe', type: 'Coffee', area: 'Downtown' },
      { id: 2, name: 'Bakery House', type: 'Bakery', area: 'City Center' },
    ],
    Lunch: [
      { id: 3, name: 'Local Bistro', type: 'Casual', area: 'City Center' },
      { id: 4, name: 'Food Court', type: 'Various', area: 'Mall' },
    ],
    Dinner: [
      { id: 5, name: 'Restaurant Bell', type: 'Fine Dining', area: 'City Center' },
      { id: 6, name: 'Family Restaurant', type: 'Casual', area: 'Downtown' },
    ],
  },
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
  const [loading, setLoading] = useState(false)

  const attractions = ATTRACTIONS[city] || ATTRACTIONS.default

  const toggleAttraction = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      const selectedAttractions = attractions.filter((a) => selected.includes(a.id))
      onNext(selectedAttractions)
      setLoading(false)
    }, 800)
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
        <button className="btn-primary" onClick={handleSubmit} disabled={selected.length === 0 || loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? 'Generating...' : 'Generate Route'}
        </button>
      </div>
    </div>
  )
}

function RouteResult({ city, days, attractions, onStartOver, onBack }) {
  const foodData = FOOD_SPOTS[city] || FOOD_SPOTS.default

  const groupByDays = () => {
    const result = []
    const attractionsPerDay = Math.ceil(attractions.length / days)
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner']
    
    for (let i = 0; i < days; i++) {
      const attrStart = i * attractionsPerDay
      const attrEnd = Math.min(attrStart + attractionsPerDay, attractions.length)
      const dayAttractions = attractions.slice(attrStart, attrEnd)
      
      const half = Math.ceil(dayAttractions.length / 2)
      const morning = dayAttractions.slice(0, half)
      const afternoon = dayAttractions.slice(half)
      
      const dayFood = mealTypes.map((meal) => {
        const spots = foodData[meal] || []
        const spot = spots[i % spots.length]
        return spot ? { ...spot, mealType: meal } : null
      }).filter(Boolean)
      
      result.push({ 
        day: i + 1, 
        morning, 
        afternoon, 
        food: dayFood 
      })
    }
    return result
  }

  const routeByDays = groupByDays()

  const getFoodByMealType = (food, type) => food.find(f => f.mealType === type)

  return (
    <div className="page">
      <h2>Your Route</h2>
      <p className="subtitle">{city} - {days} day{days > 1 ? 's' : ''}</p>
      
      <div className="hotel-notice">
        <span className="hotel-icon">🏨</span>
        <span>Hotel location</span>
        <span className="coming-soon">Coming soon</span>
      </div>
      
      <div className="route-list">
        {attractions.length === 0 ? (
          <p className="no-attractions">No attractions selected</p>
        ) : (
          routeByDays.map(({ day, morning, afternoon, food }) => (
            <div key={day} className="day-group">
              <div className="day-header">Day {day}</div>
              
              {(morning.length === 0 && afternoon.length === 0) ? (
                <div className="route-item rest-day">
                  <span className="route-bullet">•</span>
                  <span className="route-name">Rest Day</span>
                </div>
              ) : (
                <>
                  {getFoodByMealType(food, 'Breakfast') && (
                    <div className={`route-item food meal-breakfast`}>
                      <span className="meal-icon">☕</span>
                      <div className="route-food-info">
                        <span className="meal-label">Breakfast</span>
                        <span className="route-name">{getFoodByMealType(food, 'Breakfast').name}</span>
                        <span className="route-food-type">{getFoodByMealType(food, 'Breakfast').type} • {getFoodByMealType(food, 'Breakfast').area}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="time-slot">
                    <div className="time-label morning">Morning</div>
                    {morning.length === 0 ? (
                      <div className="route-item empty-slot">
                        <span className="route-name">Free time</span>
                      </div>
                    ) : (
                      morning.map((attraction, index) => (
                        <div key={`m-${index}`} className="route-item attraction">
                          <span className="route-bullet">•</span>
                          <span className="route-name">{attraction.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {getFoodByMealType(food, 'Lunch') && (
                    <div className={`route-item food meal-lunch`}>
                      <span className="meal-icon">🍜</span>
                      <div className="route-food-info">
                        <span className="meal-label">Lunch</span>
                        <span className="route-name">{getFoodByMealType(food, 'Lunch').name}</span>
                        <span className="route-food-type">{getFoodByMealType(food, 'Lunch').type} • {getFoodByMealType(food, 'Lunch').area}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="time-slot">
                    <div className="time-label afternoon">Afternoon</div>
                    {afternoon.length === 0 ? (
                      <div className="route-item empty-slot">
                        <span className="route-name">Free time</span>
                      </div>
                    ) : (
                      afternoon.map((attraction, index) => (
                        <div key={`a-${index}`} className="route-item attraction">
                          <span className="route-bullet">•</span>
                          <span className="route-name">{attraction.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {getFoodByMealType(food, 'Dinner') && (
                    <div className={`route-item food meal-dinner`}>
                      <span className="meal-icon">🍽️</span>
                      <div className="route-food-info">
                        <span className="meal-label">Dinner</span>
                        <span className="route-name">{getFoodByMealType(food, 'Dinner').name}</span>
                        <span className="route-food-type">{getFoodByMealType(food, 'Dinner').type} • {getFoodByMealType(food, 'Dinner').area}</span>
                      </div>
                    </div>
                  )}
                </>
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
