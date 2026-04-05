import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import './App.css'

const ATTRACTIONS = {
  Shanghai: [
    { id: 1, name: 'Yu Garden (豫园)', description: 'Classic Chinese garden in old town', priority: 'high', area: 'Huangpu', category: 'attractions', label: '🏛️ Historic' },
    { id: 2, name: 'The Bund (外滩)', description: 'Iconic waterfront with colonial buildings', priority: 'high', area: 'Huangpu', category: 'attractions', label: '🏛️ Landmark' },
    { id: 3, name: 'Jing\'an Temple (静安寺)', description: 'Ancient Buddhist temple in CBD', priority: 'high', area: 'Jing\'an', category: 'attractions', label: '🏛️ Cultural' },
    { id: 4, name: 'Tianzhu Church (天主教堂)', description: 'Former French Concession Gothic church', priority: 'medium', area: 'Xuhui', category: 'attractions', label: '🏛️ Historic' },
    { id: 5, name: 'Lujiazui (陆家嘴)', description: 'Financial district with skyscrapers', priority: 'medium', area: 'Pudong', category: 'attractions', label: '🏛️ Skyline' },
    { id: 6, name: 'Wukang Road (武康路)', description: 'Historic street with colonial architecture', priority: 'high', area: 'Xuhui', category: 'citywalk', label: '🚶 Citywalk' },
    { id: 7, name: 'Former French Concession', description: 'Tree-lined streets with shikumen houses', priority: 'high', area: 'Xuhui', category: 'citywalk', label: '🚶 Citywalk' },
    { id: 8, name: 'Xintiandi (新天地)', description: 'Shikumen houses converted to trendy nightlife', priority: 'high', area: 'Huangpu', category: 'citywalk', label: '🚶 Citywalk' },
    { id: 9, name: 'West Huangpu Rd (西黄浦路)', description: 'Street with old buildings along the river', priority: 'medium', area: 'Huangpu', category: 'citywalk', label: '🚶 Citywalk' },
    { id: 10, name: 'Xujiahui (徐家汇)', description: 'Shopping and cathedral area', priority: 'low', area: 'Xuhui', category: 'citywalk', label: '🚶 Citywalk' },
    { id: 11, name: 'Seesaw Coffee (见闻咖啡)', description: 'Modern specialty coffee brand', priority: 'high', area: 'Jing\'an', category: 'cafe', label: '☕ Coffee' },
    { id: 12, name: 'Manner Coffee', description: 'Popular specialty coffee with affordable prices', priority: 'high', area: 'Xuhui', category: 'cafe', label: '☕ Coffee' },
    { id: 13, name: 'Peet\'s Coffee (皮爷咖啡)', description: 'American-style specialty coffee', priority: 'medium', area: 'Xuhui', category: 'cafe', label: '☕ Coffee' },
    { id: 14, name: 'Huangpu River Night Cruise', description: 'Night cruise with skyline views', priority: 'high', area: 'Huangpu', category: 'photo', label: '📸 Photo Spot' },
    { id: 15, name: 'Nanjing Road (南京路)', description: 'Famous shopping street', priority: 'medium', area: 'Huangpu', category: 'shopping', label: '🛍️ Shopping' },
    { id: 16, name: 'Wuzhen (乌镇)', description: 'Water town with canals and bridges', priority: 'medium', area: 'Tongxiang', category: 'citywalk', label: '🚶 Day Trip' },
  ],
  Tokyo: [
    { id: 1, name: 'Tokyo Tower', description: 'Iconic red communications tower', priority: 'high', area: 'Minato', category: 'attractions', label: '🏛️ Landmark' },
    { id: 2, name: 'Senso-ji Temple', description: 'Ancient Buddhist temple in Asakusa', priority: 'high', area: 'Asakusa', category: 'attractions', label: '🏛️ Historic' },
    { id: 3, name: 'Shibuya Crossing', description: 'World-famous pedestrian crossing', priority: 'high', area: 'Shibuya', category: 'photo', label: '📸 Photo Spot' },
    { id: 4, name: 'Meiji Shrine', description: 'Shinto shrine in a forest setting', priority: 'medium', area: 'Shibuya', category: 'attractions', label: '🏛️ Cultural' },
    { id: 5, name: 'Tsukiji Market', description: 'Famous fish market', priority: 'medium', area: 'Tsukiji', category: 'food', label: '🍣 Food' },
  ],
  Paris: [
    { id: 1, name: 'Eiffel Tower', description: 'Iconic iron lattice tower', priority: 'high', area: 'Champ de Mars', category: 'attractions', label: '🏛️ Landmark' },
    { id: 2, name: 'Louvre Museum', description: 'World\'s largest art museum', priority: 'high', area: 'Louvre', category: 'attractions', label: '🏛️ Culture' },
    { id: 3, name: 'Notre-Dame', description: 'Medieval Catholic cathedral', priority: 'medium', area: 'Île de la Cité', category: 'attractions', label: '🏛️ Historic' },
    { id: 4, name: 'Champs-Élysées', description: 'Famous shopping boulevard', priority: 'medium', area: 'Champs-Élysées', category: 'shopping', label: '🛍️ Shopping' },
    { id: 5, name: 'Montmartre', description: 'Historic artists\' neighborhood', priority: 'low', area: 'Montmartre', category: 'citywalk', label: '🚶 Citywalk' },
  ],
  'New York': [
    { id: 1, name: 'Statue of Liberty', description: 'Iconic gift from France', priority: 'high', area: 'Battery Park', category: 'attractions', label: '🏛️ Landmark' },
    { id: 2, name: 'Central Park', description: 'Urban park in Manhattan', priority: 'high', area: 'Midtown', category: 'attractions', label: '🏛️ Nature' },
    { id: 3, name: 'Times Square', description: 'Bright lights and Broadway', priority: 'medium', area: 'Midtown', category: 'photo', label: '📸 Photo Spot' },
    { id: 4, name: 'Empire State Building', description: 'Art deco skyscraper', priority: 'medium', area: 'Midtown', category: 'attractions', label: '🏛️ Iconic' },
    { id: 5, name: 'Brooklyn Bridge', description: 'Historic suspension bridge', priority: 'low', area: 'Brooklyn', category: 'photo', label: '📸 Photo Spot' },
  ],
  London: [
    { id: 1, name: 'Big Ben', description: 'Famous clock tower', priority: 'high', area: 'Westminster', category: 'attractions', label: '🏛️ Landmark' },
    { id: 2, name: 'Tower of London', description: 'Historic castle and fortress', priority: 'high', area: 'Tower Hill', category: 'attractions', label: '🏛️ Historic' },
    { id: 3, name: 'Buckingham Palace', description: 'Royal residence', priority: 'medium', area: 'Westminster', category: 'attractions', label: '🏛️ Royal' },
    { id: 4, name: 'British Museum', description: 'World-renowned museum', priority: 'medium', area: 'Bloomsbury', category: 'attractions', label: '🏛️ Culture' },
    { id: 5, name: 'London Eye', description: 'Giant observation wheel', priority: 'low', area: 'Westminster', category: 'photo', label: '📸 Photo Spot' },
  ],
  Rome: [
    { id: 1, name: 'Colosseum', description: 'Ancient Roman amphitheater', priority: 'high', area: 'Centro', category: 'attractions', label: '🏛️ Landmark' },
    { id: 2, name: 'Vatican Museums', description: 'Art museums in Vatican', priority: 'high', area: 'Vatican', category: 'attractions', label: '🏛️ Culture' },
    { id: 3, name: 'Trevi Fountain', description: 'Baroque fountain', priority: 'medium', area: 'Centro', category: 'photo', label: '📸 Photo Spot' },
    { id: 4, name: 'Roman Forum', description: 'Ancient Roman ruins', priority: 'medium', area: 'Centro', category: 'attractions', label: '🏛️ Historic' },
    { id: 5, name: 'Pantheon', description: 'Ancient Roman temple', priority: 'low', area: 'Centro', category: 'attractions', label: '🏛️ Historic' },
  ],
  default: [
    { id: 1, name: 'City Center', description: 'Main downtown area', priority: 'high', area: 'Downtown', label: '⭐ Must Visit' },
    { id: 2, name: 'Historic Old Town', description: 'Traditional historic district', priority: 'high', area: 'Old Town', label: '🏛️ Historic' },
    { id: 3, name: 'Local Market', description: 'Fresh produce and crafts', priority: 'medium', area: 'Downtown', label: '🛒 Local' },
    { id: 4, name: 'Central Park', description: 'Beautiful city park', priority: 'medium', area: 'Midtown', label: '🌳 Nature' },
    { id: 5, name: 'Museum District', description: 'Cultural attractions', priority: 'low', area: 'Cultural', label: '🎨 Culture' },
  ],
}

const FOOD_SPOTS = {
  Shanghai: {
    Breakfast: [
      { id: 1, name: 'Manner Coffee', type: 'Specialty Coffee', area: 'Xuhui' },
      { id: 2, name: 'Seesaw Coffee', type: 'Specialty Coffee', area: 'Jing\'an' },
      { id: 3, name: 'Egg Drop', type: 'Sandwich', area: 'Huangpu' },
      { id: 4, name: 'Lost Bakery', type: 'Bakery', area: 'Xuhui' },
      { id: 5, name: 'B Specification', type: 'Toast', area: 'Xuhui' },
      { id: 6, name: 'Morning Sleep', type: 'Brunch', area: 'Huangpu' },
    ],
    Lunch: [
      { id: 4, name: 'Haidilao (海底捞)', type: 'Hotpot', area: 'Xuhui' },
      { id: 5, name: 'Lost Bakery', type: 'Bistro', area: 'Xuhui' },
      { id: 6, name: 'Shenzhen Lu (深圳路)', type: 'Dim Sum', area: 'Huangpu' },
    ],
    Dinner: [
      { id: 7, name: 'Ultraviolet by Paul Pairet', type: 'Fine Dining', area: 'Huangpu' },
      { id: 8, name: 'Fu He (福和)', type: 'Chinese Fusion', area: 'Xuhui' },
      { id: 9, name: 'The Cannery', type: 'Seafood', area: 'Huangpu' },
    ],
  },
  Tokyo: {
    Breakfast: [
      { id: 1, name: 'Blue Bottle Coffee', type: 'Cafe', area: 'Omotesando' },
      { id: 2, name: 'Komeda Coffee', type: 'Coffee Shop', area: 'Shibuya' },
      { id: 3, name: 'Lawson Store', type: 'Convenience', area: 'Various' },
      { id: 4, name: 'Sarabeth\'s', type: 'Brunch', area: 'Omotesando' },
      { id: 5, name: 'Eggoman', type: 'Sandwich', area: 'Shibuya' },
      { id: 6, name: 'B的外', type: 'Toast', area: 'Shibuya' },
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
      { id: 4, name: 'Ten Belles', type: 'Brunch', area: 'Canal Saint-Martin' },
      { id: 5, name: 'Kauder', type: 'Bakery', area: 'Le Marais' },
      { id: 6, name: 'Café Merlin', type: 'Cafe', area: 'Montparnasse' },
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
      { id: 3, name: 'Morning Bistro', type: 'Brunch', area: 'Downtown' },
      { id: 4, name: 'Toast House', type: 'Toast', area: 'City Center' },
      { id: 5, name: 'Local Diner', type: 'Light Meal', area: 'Downtown' },
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

const CITIES = ['Shanghai', 'Tokyo', 'Paris', 'New York', 'London', 'Rome']

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
  const [error, setError] = useState('')

  const attractions = ATTRACTIONS[city] || ATTRACTIONS.default

  const groupByCategory = () => {
    const groups = {}
    attractions.forEach(a => {
      const cat = a.category || 'attractions'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(a)
    })
    return groups
  }

  const grouped = groupByCategory()

  const toggleAttraction = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
    setError('')
  }

  const handleSubmit = () => {
    const selectedAttractions = attractions.filter((a) => selected.includes(a.id))
    console.log('Selected attractions:', selectedAttractions)
    
    if (selectedAttractions.length === 0) {
      alert('Please select at least 1 attraction')
      return
    }
    setLoading(true)
    setTimeout(() => {
      onNext(selectedAttractions)
      setLoading(false)
    }, 800)
  }

  return (
    <div className="page">
      <h2>Select Attractions</h2>
      <p className="subtitle">{city} - {days} days</p>
      <div className="attraction-list">
        {Object.entries(grouped).map(([category, items]) => {
          const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.attractions
          return (
            <div key={category} className="category-group">
              <div className="category-header" style={{ borderLeftColor: config.color }}>
                <span className="category-icon">{config.icon}</span>
                <span className="category-name">{config.name}</span>
              </div>
              {items.map((attraction) => (
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
                  <span className="item-label" style={{ backgroundColor: config.color + '20', color: config.color }}>{attraction.label}</span>
                </label>
              ))}
            </div>
          )
        })}
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="button-row">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? 'Generating...' : 'Generate Route'}
        </button>
      </div>
    </div>
  )
}

const CATEGORY_CONFIG = {
  attractions: { icon: '🏛️', name: 'Attractions', color: '#3b82f6' },
  citywalk: { icon: '🚶', name: 'Citywalk', color: '#10b981' },
  cafe: { icon: '☕', name: 'Cafe', color: '#92400e' },
  photo: { icon: '📸', name: 'Photo Spot', color: '#ec4899' },
  food: { icon: '🍜', name: 'Food', color: '#f59e0b' },
  shopping: { icon: '🛍️', name: 'Shopping', color: '#8b5cf6' },
}

function AddModalList({ items, onSelect }) {
  const [expandedCats, setExpandedCats] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500 + Math.random() * 300)
    return () => clearTimeout(timer)
  }, [])

  const groupByCategory = () => {
    const groups = {}
    items.forEach(a => {
      const cat = a.category || 'attractions'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(a)
    })
    return groups
  }

  const grouped = groupByCategory()

  const toggleCategory = (cat) => {
    setExpandedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const categoryOrder = ['attractions', 'citywalk', 'cafe', 'photo', 'food', 'shopping']
  const orderedGroups = categoryOrder.filter(cat => grouped[cat]?.length > 0)

  const getRecommendedItem = (items) => items.find(item => item.priority === 'high')
  const getRegularItems = (items, recommended) => items.filter(item => item !== recommended)

  if (isLoading) {
    return (
      <div className="add-modal-list">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-line title"></div>
            <div className="skeleton-line tag"></div>
            <div className="skeleton-line desc"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="add-modal-list">
      {orderedGroups.map(category => {
        const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.attractions
        const isExpanded = expandedCats.includes(category)
        const catItems = grouped[category]
        const recommended = getRecommendedItem(catItems)
        const regularItems = getRegularItems(catItems, recommended)
        
        return (
          <div key={category} className="modal-category">
            <div 
              className="modal-category-header"
              style={{ borderLeftColor: config.color }}
              onClick={() => toggleCategory(category)}
            >
              <span className="collapse-arrow">{isExpanded ? '▼' : '▶'}</span>
              <span className="category-icon">{config.icon}</span>
              <span className="category-name">{config.name}</span>
              <span className="category-count">({catItems.length})</span>
            </div>
            {isExpanded && (
              <div className="modal-category-items">
                {recommended && (
                  <div 
                    key={recommended.id} 
                    className="attraction-option recommended"
                    onClick={() => onSelect(recommended)}
                  >
                    <span className="recommended-badge">⭐</span>
                    <span className="option-name">{recommended.name}</span>
                    <span className="option-label" style={{ backgroundColor: config.color + '20', color: config.color }}>{recommended.label}</span>
                    <span className="option-desc">{recommended.description}</span>
                  </div>
                )}
                {regularItems.map(attraction => (
                  <div 
                    key={attraction.id} 
                    className="attraction-option"
                    onClick={() => onSelect(attraction)}
                  >
                    <span className="option-name">{attraction.name}</span>
                    <span className="option-label" style={{ backgroundColor: config.color + '20', color: config.color }}>{attraction.label}</span>
                    <span className="option-desc">{attraction.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function RouteResult({ city, days, attractions, onStartOver, onBack }) {
  const [currentDay, setCurrentDay] = useState(0)
  const [routeData, setRouteData] = useState(null)
  const [showAddModal, setShowAddModal] = useState(null)
  const [restDays, setRestDays] = useState(new Set())
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
      const morning = dayAttractions.slice(0, half).map((a, idx) => ({ ...a, slot: 'morning', idx }))
      const afternoon = dayAttractions.slice(half).map((a, idx) => ({ ...a, slot: 'afternoon', idx }))
      
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

  const routeByDays = routeData || groupByDays()

  const isItineraryEmpty = routeByDays.every(
    day => day.morning.length === 0 && day.afternoon.length === 0
  )

  const toggleRestDay = (dayIndex) => {
    setRestDays(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dayIndex)) {
        newSet.delete(dayIndex)
      } else {
        newSet.add(dayIndex)
      }
      return newSet
    })
  }

  const getAllSelectedAttractionNames = () => {
    const names = new Set()
    routeByDays.forEach(day => {
      day.morning.forEach(a => names.add(a.name))
      day.afternoon.forEach(a => names.add(a.name))
    })
    return names
  }

  const getCurrentDayArea = () => {
    const dayData = routeByDays[currentDay]
    const areas = new Set()
    dayData.morning.forEach(a => a.area && areas.add(a.area))
    dayData.afternoon.forEach(a => a.area && areas.add(a.area))
    return areas.size > 0 ? Array.from(areas)[0] : null
  }

  const availableAttractions = ATTRACTIONS[city] || ATTRACTIONS.default
  const selectedNames = getAllSelectedAttractionNames()
  const currentArea = getCurrentDayArea()
  let unusedAttractions = availableAttractions.filter(a => !selectedNames.has(a.name))
  
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  unusedAttractions.sort((a, b) => {
    if (currentArea) {
      const aInArea = a.area === currentArea ? 0 : 1
      const bInArea = b.area === currentArea ? 0 : 1
      if (aInArea !== bInArea) return aInArea - bInArea
    }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const getFoodByMealType = (food, type) => food.find(f => f.mealType === type)

  const removeAttraction = (dayIndex, slot, itemIdx) => {
    const newData = [...routeByDays]
    newData[dayIndex] = {
      ...newData[dayIndex],
      [slot]: newData[dayIndex][slot].filter((_, i) => i !== itemIdx)
    }
    setRouteData(newData)
  }

  const replaceFood = (dayIndex, mealType) => {
    const currentFood = routeByDays[dayIndex].food
    const current = getFoodByMealType(currentFood, mealType)
    const allFood = foodData[mealType] || []
    const currentIndex = allFood.findIndex(f => f.id === current?.id)
    const nextIndex = (currentIndex + 1) % allFood.length
    const newFood = { ...allFood[nextIndex], mealType }
    
    const newData = [...routeByDays]
    newData[dayIndex] = {
      ...newData[dayIndex],
      food: currentFood.map(f => f.mealType === mealType ? newFood : f)
    }
    setRouteData(newData)
  }

  const moveItem = (dayIndex, slot, itemIdx, direction) => {
    const items = [...routeByDays[dayIndex][slot]]
    const newIdx = itemIdx + direction
    if (newIdx < 0 || newIdx >= items.length) return
    const newItems = [...items]
    ;[newItems[itemIdx], newItems[newIdx]] = [newItems[newIdx], newItems[itemIdx]]
    
    const newData = [...routeByDays]
    newData[dayIndex] = { ...newData[dayIndex], [slot]: newItems }
    setRouteData(newData)
  }

  const addAttraction = (dayIndex, slot, attraction) => {
    const newData = [...routeByDays]
    newData[dayIndex] = {
      ...newData[dayIndex],
      [slot]: [...newData[dayIndex][slot], { ...attraction, slot, idx: newData[dayIndex][slot].length }]
    }
    setRouteData(newData)
    if (restDays.has(dayIndex)) {
      setRestDays(prev => {
        const newSet = new Set(prev)
        newSet.delete(dayIndex)
        return newSet
      })
    }
    setShowAddModal(null)
  }

  const handleAddClick = (dayIndex, slot) => {
    setShowAddModal({ dayIndex, slot })
  }

  const renderDayCard = (dayData, dayIndex) => {
    const isRestDay = restDays.has(dayIndex)
    const isEmpty = dayData.morning.length === 0 && dayData.afternoon.length === 0
    
    return (
    <div className="day-card">
      <div className="day-header">
        <span>Day {dayData.day}</span>
      </div>
      
      {isRestDay ? (
        <div className="rest-day">
          <span className="route-bullet">•</span>
          <span className="route-name">Rest Day</span>
          <button className="btn-secondary rest-day-btn" onClick={() => toggleRestDay(dayIndex)}>Mark as Day with Plans</button>
        </div>
      ) : isEmpty ? (
        <div className="empty-day">
          <p className="empty-day-text">No places planned yet</p>
          <button className="add-btn" onClick={() => handleAddClick(dayIndex, 'morning')}>+ Add Attraction</button>
          <button className="btn-secondary rest-day-btn" onClick={() => toggleRestDay(dayIndex)}>Mark as Rest Day</button>
        </div>
      ) : (
        <>
          {getFoodByMealType(dayData.food, 'Breakfast') && (
            <div className={`route-item food meal-breakfast`}>
              <span className="meal-icon">🍳</span>
              <div className="route-food-info">
                <span className="meal-label">Breakfast</span>
                <span className="route-name">{getFoodByMealType(dayData.food, 'Breakfast').name}</span>
                <span className="route-food-type">{getFoodByMealType(dayData.food, 'Breakfast').type} • {getFoodByMealType(dayData.food, 'Breakfast').area}</span>
              </div>
              <button className="edit-btn" onClick={() => replaceFood(dayIndex, 'Breakfast')}>↻</button>
            </div>
          )}
          
          <div className="time-slot">
            <div className="time-label morning">Morning</div>
            {dayData.morning.length === 0 ? (
              <div className="route-item empty-slot">
                <span className="route-name">Free time</span>
              </div>
            ) : (
              dayData.morning.map((attraction, index) => (
                <div key={`m-${index}`} className="route-item attraction">
                  <span className="route-bullet">•</span>
                  <span className="route-name">{attraction.name}</span>
                  <div className="item-actions">
                    <button className="move-btn" onClick={() => moveItem(dayIndex, 'morning', index, -1)} disabled={index === 0}>↑</button>
                    <button className="move-btn" onClick={() => moveItem(dayIndex, 'morning', index, 1)} disabled={index === dayData.morning.length - 1}>↓</button>
                    <button className="remove-btn" onClick={() => removeAttraction(dayIndex, 'morning', index)}>×</button>
                  </div>
                </div>
              ))
            )}
            <button className="add-btn" onClick={() => handleAddClick(dayIndex, 'morning')}>+ Add Attraction</button>
          </div>
          
          {getFoodByMealType(dayData.food, 'Lunch') && (
            <div className={`route-item food meal-lunch`}>
              <span className="meal-icon">🍜</span>
              <div className="route-food-info">
                <span className="meal-label">Lunch</span>
                <span className="route-name">{getFoodByMealType(dayData.food, 'Lunch').name}</span>
                <span className="route-food-type">{getFoodByMealType(dayData.food, 'Lunch').type} • {getFoodByMealType(dayData.food, 'Lunch').area}</span>
              </div>
              <button className="edit-btn" onClick={() => replaceFood(dayIndex, 'Lunch')}>↻</button>
            </div>
          )}
          
          <div className="time-slot">
            <div className="time-label afternoon">Afternoon</div>
            {dayData.afternoon.length === 0 ? (
              <div className="route-item empty-slot">
                <span className="route-name">Free time</span>
              </div>
            ) : (
              dayData.afternoon.map((attraction, index) => (
                <div key={`a-${index}`} className="route-item attraction">
                  <span className="route-bullet">•</span>
                  <span className="route-name">{attraction.name}</span>
                  <div className="item-actions">
                    <button className="move-btn" onClick={() => moveItem(dayIndex, 'afternoon', index, -1)} disabled={index === 0}>↑</button>
                    <button className="move-btn" onClick={() => moveItem(dayIndex, 'afternoon', index, 1)} disabled={index === dayData.afternoon.length - 1}>↓</button>
                    <button className="remove-btn" onClick={() => removeAttraction(dayIndex, 'afternoon', index)}>×</button>
                  </div>
                </div>
              ))
            )}
            <button className="add-btn" onClick={() => handleAddClick(dayIndex, 'afternoon')}>+ Add Attraction</button>
          </div>
          
          {getFoodByMealType(dayData.food, 'Dinner') && (
            <div className={`route-item food meal-dinner`}>
              <span className="meal-icon">🍽️</span>
              <div className="route-food-info">
                <span className="meal-label">Dinner</span>
                <span className="route-name">{getFoodByMealType(dayData.food, 'Dinner').name}</span>
                <span className="route-food-type">{getFoodByMealType(dayData.food, 'Dinner').type} • {getFoodByMealType(dayData.food, 'Dinner').area}</span>
              </div>
              <button className="edit-btn" onClick={() => replaceFood(dayIndex, 'Dinner')}>↻</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

  if (attractions.length === 0) {
    return (
      <div className="page">
        <h2>Your Route</h2>
        <p className="subtitle">{city} - {days} day{days > 1 ? 's' : ''}</p>
        <p className="no-attractions">No attractions selected</p>
        <div className="button-row">
          <button className="btn-secondary" onClick={onBack}>Back</button>
          <button className="btn-primary" onClick={onStartOver}>Start Over</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h2>Your Route</h2>
      <p className="subtitle">{city} - {days} day{days > 1 ? 's' : ''}</p>
      
      <div className="hotel-notice">
        <span className="hotel-icon">🏨</span>
        <span>Hotel location</span>
        <span className="coming-soon">Coming soon</span>
      </div>

      <Swiper
        modules={[Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setCurrentDay(swiper.activeIndex)}
        className="day-swiper"
      >
        {routeByDays.map((dayData, index) => (
          <SwiperSlide key={index}>
            {renderDayCard(dayData, index)}
          </SwiperSlide>
        ))}
      </Swiper>

      {isItineraryEmpty && (
        <div className="empty-itinerary">
          <p className="empty-title">No itinerary yet</p>
          <p className="empty-subtitle">Start adding places ✨</p>
          <button className="btn-primary" onClick={() => handleAddClick(0, 'morning')}>+ Add Attraction</button>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(null)}>
          <div className="modal-content add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Attraction</h3>
            </div>
            <div className="modal-body">
              {unusedAttractions.length === 0 ? (
                <p className="no-attractions">All attractions have been selected</p>
              ) : (
                <AddModalList 
                  items={unusedAttractions} 
                  onSelect={(attraction) => addAttraction(showAddModal.dayIndex, showAddModal.slot, attraction)}
                />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

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
