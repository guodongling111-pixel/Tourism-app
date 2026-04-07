import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import 'swiper/css'
import 'swiper/css/pagination'
import './App.css'

const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}
fixLeafletIcon()

const MOCK_MARKERS = [
  { id: 1, name: 'Yu Garden', lat: 31.2284, lng: 121.4956 },
  { id: 2, name: 'The Bund', lat: 31.2408, lng: 121.4991 },
  { id: 3, name: 'Jing\'an Temple', lat: 31.2286, lng: 121.4458 },
  { id: 4, name: 'Nanjing Road', lat: 31.2297, lng: 121.4809 },
  { id: 5, name: 'Xintiandi', lat: 31.2184, lng: 121.4811 },
]

function RouteMap({ dayData, currentDay }) {
  const mapRef = useRef(null)
  
  useEffect(() => {
    console.log('Map update - currentDay:', currentDay)
    console.log('Map dayData:', dayData)
  }, [currentDay, dayData])
  
  useEffect(() => {
    if (mapRef.current && dayData) {
      const validMarkers = [
        ...(dayData.morning || []),
        ...(dayData.afternoon || []),
        ...(dayData.evening || [])
      ].filter(a => a.lat && a.lng)
      
      if (validMarkers.length > 0) {
        if (validMarkers.length === 1) {
          mapRef.current.setView([validMarkers[0].lat, validMarkers[0].lng], 14)
        } else {
          const bounds = validMarkers.map(m => [m.lat, m.lng])
          mapRef.current.fitBounds(bounds, { padding: [50, 50] })
        }
      }
    }
  }, [dayData])
  
  const cityCoords = {
    Shanghai: [31.2304, 121.4737],
    Tokyo: [35.6762, 139.6503],
    Paris: [48.8566, 2.3522],
    'New York': [40.7128, -74.0060],
    London: [51.5074, -0.1278],
    Rome: [41.9028, 12.4964],
  }
  
  const defaultCenter = [31.2304, 121.4737]
  const center = cityCoords['Shanghai'] || defaultCenter
  
  const allAttractions = [...(dayData?.morning || []), ...(dayData?.afternoon || []), ...(dayData?.evening || [])]
  const validMarkers = allAttractions.filter(a => a.lat && a.lng)
  
  const getMarkerNumber = (idx) => {
    const morningCount = dayData?.morning?.length || 0
    if (idx < morningCount) return idx + 1
    return idx + 1
  }
  
  return (
    <div style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      <MapContainer 
        ref={mapRef}
        center={center} 
        zoom={12} 
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validMarkers.length > 1 && (
          <Polyline
            positions={validMarkers.map(m => [m.lat, m.lng])}
            color="#3b82f6"
            weight={3}
            opacity={0.7}
          />
        )}
        {validMarkers.map((marker, idx) => (
          <Marker 
            key={`${currentDay}-${marker.slot}-${idx}`} 
            position={[marker.lat, marker.lng]}
          >
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              Stop {getMarkerNumber(idx)} • {marker.slot}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

const ATTRACTIONS = {
  Shanghai: [
    { id: 1, name: 'Yu Garden (豫园)', description: 'Classic Chinese garden in old town', priority: 'high', area: 'Huangpu', category: 'attractions', label: '🏛️ Historic', lat: 31.2278, lng: 121.4921 },
    { id: 2, name: 'The Bund (外滩)', description: 'Iconic waterfront with colonial buildings', priority: 'high', area: 'Huangpu', category: 'attractions', label: '🏛️ Landmark', lat: 31.2408, lng: 121.4901 },
    { id: 3, name: 'Jing\'an Temple (静安寺)', description: 'Ancient Buddhist temple in CBD', priority: 'high', area: 'Jing\'an', category: 'attractions', label: '🏛️ Cultural', lat: 31.2286, lng: 121.4458 },
    { id: 4, name: 'Tianzhu Church (天主教堂)', description: 'Former French Concession Gothic church', priority: 'medium', area: 'Xuhui', category: 'attractions', label: '🏛️ Historic', lat: 31.2061, lng: 121.4329 },
    { id: 5, name: 'Lujiazui (陆家嘴)', description: 'Financial district with skyscrapers', priority: 'medium', area: 'Pudong', category: 'attractions', label: '🏛️ Skyline', lat: 31.2203, lng: 121.5356 },
    { id: 6, name: 'Wukang Road (武康路)', description: 'Historic street with colonial architecture', priority: 'high', area: 'Xuhui', category: 'citywalk', label: '🚶 Citywalk', lat: 31.2089, lng: 121.4361 },
    { id: 7, name: 'Former French Concession', description: 'Tree-lined streets with shikumen houses', priority: 'high', area: 'Xuhui', category: 'citywalk', label: '🚶 Citywalk', lat: 31.2043, lng: 121.4482 },
    { id: 8, name: 'Xintiandi (新天地)', description: 'Shikumen houses converted to trendy nightlife', priority: 'high', area: 'Huangpu', category: 'citywalk', label: '🚶 Citywalk', lat: 31.2184, lng: 121.4811 },
    { id: 9, name: 'West Huangpu Rd (西黄浦路)', description: 'Street with old buildings along the river', priority: 'medium', area: 'Huangpu', category: 'citywalk', label: '🚶 Citywalk', lat: 31.2324, lng: 121.4872 },
    { id: 10, name: 'Xujiahui (徐家汇)', description: 'Shopping and cathedral area', priority: 'low', area: 'Xuhui', category: 'citywalk', label: '🚶 Citywalk', lat: 31.2004, lng: 121.4334 },
    { id: 11, name: 'Seesaw Coffee (见闻咖啡)', description: 'Modern specialty coffee brand', priority: 'high', area: 'Jing\'an', category: 'cafe', label: '☕ Coffee', lat: 31.2234, lng: 121.4478 },
    { id: 12, name: 'Manner Coffee', description: 'Popular specialty coffee with affordable prices', priority: 'high', area: 'Xuhui', category: 'cafe', label: '☕ Coffee', lat: 31.2078, lng: 121.4412 },
    { id: 13, name: 'Peet\'s Coffee (皮爷咖啡)', description: 'American-style specialty coffee', priority: 'medium', area: 'Xuhui', category: 'cafe', label: '☕ Coffee', lat: 31.2099, lng: 121.4501 },
    { id: 14, name: 'Huangpu River Night Cruise', description: 'Night cruise with skyline views', priority: 'high', area: 'Huangpu', category: 'photo', label: '📸 Photo Spot', lat: 31.2389, lng: 121.5012 },
    { id: 15, name: 'Nanjing Road (南京路)', description: 'Famous shopping street', priority: 'medium', area: 'Huangpu', category: 'shopping', label: '🛍️ Shopping', lat: 31.2297, lng: 121.4809 },
    { id: 16, name: 'Wuzhen (乌镇)', description: 'Water town with canals and bridges', priority: 'medium', area: 'Tongxiang', category: 'citywalk', label: '🚶 Day Trip', lat: 30.7421, lng: 120.4932 },
  ],
  Tokyo: [
    { id: 1, name: 'Tokyo Tower', description: 'Iconic red communications tower', priority: 'high', area: 'Minato', category: 'attractions', label: '🏛️ Landmark', lat: 35.6586, lng: 139.7454 },
    { id: 2, name: 'Senso-ji Temple', description: 'Ancient Buddhist temple in Asakusa', priority: 'high', area: 'Asakusa', category: 'attractions', label: '🏛️ Historic', lat: 35.7148, lng: 139.7967 },
    { id: 3, name: 'Shibuya Crossing', description: 'World-famous pedestrian crossing', priority: 'high', area: 'Shibuya', category: 'photo', label: '📸 Photo Spot', lat: 35.6595, lng: 139.7004 },
    { id: 4, name: 'Meiji Shrine', description: 'Shinto shrine in a forest setting', priority: 'medium', area: 'Shibuya', category: 'attractions', label: '🏛️ Cultural', lat: 35.6764, lng: 139.6993 },
    { id: 5, name: 'Tsukiji Market', description: 'Famous fish market', priority: 'medium', area: 'Tsukiji', category: 'food', label: '🍣 Food', lat: 35.6654, lng: 139.7707 },
  ],
  Paris: [
    { id: 1, name: 'Eiffel Tower', description: 'Iconic iron lattice tower', priority: 'high', area: 'Champ de Mars', category: 'attractions', label: '🏛️ Landmark', lat: 48.8584, lng: 2.2945 },
    { id: 2, name: 'Louvre Museum', description: 'World\'s largest art museum', priority: 'high', area: 'Louvre', category: 'attractions', label: '🏛️ Culture', lat: 48.8606, lng: 2.3376 },
    { id: 3, name: 'Notre-Dame', description: 'Medieval Catholic cathedral', priority: 'medium', area: 'Île de la Cité', category: 'attractions', label: '🏛️ Historic', lat: 48.8530, lng: 2.3499 },
    { id: 4, name: 'Champs-Élysées', description: 'Famous shopping boulevard', priority: 'medium', area: 'Champs-Élysées', category: 'shopping', label: '🛍️ Shopping', lat: 48.8698, lng: 2.3078 },
    { id: 5, name: 'Montmartre', description: 'Historic artists\' neighborhood', priority: 'low', area: 'Montmartre', category: 'citywalk', label: '🚶 Citywalk', lat: 48.8867, lng: 2.3431 },
  ],
  'New York': [
    { id: 1, name: 'Statue of Liberty', description: 'Iconic gift from France', priority: 'high', area: 'Battery Park', category: 'attractions', label: '🏛️ Landmark', lat: 40.6892, lng: -74.0445 },
    { id: 2, name: 'Central Park', description: 'Urban park in Manhattan', priority: 'high', area: 'Midtown', category: 'attractions', label: '🏛️ Nature', lat: 40.7812, lng: -73.9665 },
    { id: 3, name: 'Times Square', description: 'Bright lights and Broadway', priority: 'medium', area: 'Midtown', category: 'photo', label: '📸 Photo Spot', lat: 40.7580, lng: -73.9855 },
    { id: 4, name: 'Empire State Building', description: 'Art deco skyscraper', priority: 'medium', area: 'Midtown', category: 'attractions', label: '🏛️ Iconic', lat: 40.7484, lng: -73.9857 },
    { id: 5, name: 'Brooklyn Bridge', description: 'Historic suspension bridge', priority: 'low', area: 'Brooklyn', category: 'photo', label: '📸 Photo Spot', lat: 40.7061, lng: -73.9969 },
  ],
  London: [
    { id: 1, name: 'Big Ben', description: 'Famous clock tower', priority: 'high', area: 'Westminster', category: 'attractions', label: '🏛️ Landmark', lat: 51.5007, lng: -0.1246 },
    { id: 2, name: 'Tower of London', description: 'Historic castle and fortress', priority: 'high', area: 'Tower Hill', category: 'attractions', label: '🏛️ Historic', lat: 51.5081, lng: -0.0759 },
    { id: 3, name: 'Buckingham Palace', description: 'Royal residence', priority: 'medium', area: 'Westminster', category: 'attractions', label: '🏛️ Royal', lat: 51.5014, lng: -0.1419 },
    { id: 4, name: 'British Museum', description: 'World-renowned museum', priority: 'medium', area: 'Bloomsbury', category: 'attractions', label: '🏛️ Culture', lat: 51.5194, lng: -0.1270 },
    { id: 5, name: 'London Eye', description: 'Giant observation wheel', priority: 'low', area: 'Westminster', category: 'photo', label: '📸 Photo Spot', lat: 51.5033, lng: -0.1196 },
  ],
  Rome: [
    { id: 1, name: 'Colosseum', description: 'Ancient Roman amphitheater', priority: 'high', area: 'Centro', category: 'attractions', label: '🏛️ Landmark', lat: 41.8902, lng: 12.4922 },
    { id: 2, name: 'Vatican Museums', description: 'Art museums in Vatican', priority: 'high', area: 'Vatican', category: 'attractions', label: '🏛️ Culture', lat: 41.9050, lng: 12.4490 },
    { id: 3, name: 'Trevi Fountain', description: 'Baroque fountain', priority: 'medium', area: 'Centro', category: 'photo', label: '📸 Photo Spot', lat: 41.9009, lng: 12.4833 },
    { id: 4, name: 'Roman Forum', description: 'Ancient Roman ruins', priority: 'medium', area: 'Centro', category: 'attractions', label: '🏛️ Historic', lat: 41.8925, lng: 12.4853 },
    { id: 5, name: 'Pantheon', description: 'Ancient Roman temple', priority: 'low', area: 'Centro', category: 'attractions', label: '🏛️ Historic', lat: 41.8986, lng: 12.4769 },
  ],
  default: [
    { id: 1, name: 'City Center', description: 'Main downtown area', priority: 'high', area: 'Downtown', label: '⭐ Must Visit', lat: 40.7128, lng: -74.0060 },
    { id: 2, name: 'Historic Old Town', description: 'Traditional historic district', priority: 'high', area: 'Old Town', label: '🏛️ Historic', lat: 40.7195, lng: -74.0020 },
    { id: 3, name: 'Local Market', description: 'Fresh produce and crafts', priority: 'medium', area: 'Downtown', label: '🛒 Local', lat: 40.7150, lng: -74.0080 },
    { id: 4, name: 'Central Park', description: 'Beautiful city park', priority: 'medium', area: 'Midtown', label: '🌳 Nature', lat: 40.7829, lng: -73.9654 },
    { id: 5, name: 'Museum District', description: 'Cultural attractions', priority: 'low', area: 'Cultural', label: '🎨 Culture', lat: 40.7794, lng: -73.9632 },
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

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

function RouteResult({ city, days, attractions, onStartOver, onBack }) {
  const [currentDay, setCurrentDay] = useState(0)
  const [routeData, setRouteData] = useState(null)
  const [showAddModal, setShowAddModal] = useState(null)
  const [restDays, setRestDays] = useState(new Set())
  const foodData = FOOD_SPOTS[city] || FOOD_SPOTS.default

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id
    const overId = over.id

    let foundDayIndex = -1
    let foundSlot = ''
    let foundOldIndex = -1
    let foundNewIndex = -1

    for (let d = 0; d < routeByDays.length; d++) {
      const day = routeByDays[d]
      for (const slot of ['morning', 'afternoon']) {
        const items = day[slot] || []
        const oldIdx = items.findIndex(i => i.id === activeId)
        const newIdx = items.findIndex(i => i.id === overId)
        if (oldIdx !== -1 && newIdx !== -1) {
          foundDayIndex = d
          foundSlot = slot
          foundOldIndex = oldIdx
          foundNewIndex = newIdx
          break
        }
      }
      if (foundDayIndex !== -1) break
    }

    if (foundDayIndex === -1) return

    const items = [...routeByDays[foundDayIndex][foundSlot]]
    const movedItems = arrayMove(items, foundOldIndex, foundNewIndex).map((a, idx) => ({ ...a, idx }))
    const updatedItems = addTransportToItems(movedItems)

    const newData = [...routeByDays]
    newData[foundDayIndex] = {
      ...newData[foundDayIndex],
      [foundSlot]: updatedItems
    }
    setRouteData(newData)
  }

  const MAX_ATTRACTIONS_PER_DAY = 3

  const AREA_ORDER = {
    Shanghai: ['Huangpu', 'Jing\'an', 'Xuhui', 'Pudong'],
    Tokyo: ['Shibuya', 'Asakusa', 'Minato', 'Tsukiji'],
    Paris: ['Champs-Élysées', 'Montmartre', 'Latin Quarter', 'Le Marais'],
  }

  const NIGHT_ATTRACTIONS = [
    'Night Cruise', 'Night View', 'Evening', 'dinner', 'Rooftop'
  ]

  const isNightAttraction = (name) => {
    return NIGHT_ATTRACTIONS.some(key => 
      name.toLowerCase().includes(key.toLowerCase())
    )
  }

  const getAreaOrder = (area) => {
    const cityOrder = AREA_ORDER[city] || Object.values(AREA_ORDER).flat()
    const idx = cityOrder.indexOf(area)
    return idx >= 0 ? idx : 999
  }

  const getDistanceKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const getTransportToNext = (current, next) => {
    if (!next) return null

    const sameArea = current.area === next.area
    if (sameArea) {
      return { type: 'walk', duration: `${10 + Math.floor(Math.random() * 11)} min` }
    }

    const dist = current.lat && next.lat ? getDistanceKm(current.lat, current.lng, next.lat, next.lng) : 0

    if (dist < 3) {
      return { type: 'metro', duration: `${15 + Math.floor(Math.random() * 16)} min` }
    }
    return { type: 'taxi', duration: `${20 + Math.floor(Math.random() * 21)} min` }
  }

  const addTransportToItems = (items) => {
    return items.map((item, idx) => ({
      ...item,
      transportToNext: getTransportToNext(item, items[idx + 1])
    }))
  }

  const groupByDays = () => {
    const result = []
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner']
    
    const attractionsWithMeta = attractions.map(a => ({
      ...a,
      area: a.area || 'default',
      isNight: isNightAttraction(a.name),
      areaOrder: getAreaOrder(a.area)
    }))
    
    const areaGroups = {}
    attractionsWithMeta.forEach(a => {
      if (!areaGroups[a.area]) areaGroups[a.area] = []
      areaGroups[a.area].push(a)
    })
    
    const sortedAreas = Object.entries(areaGroups)
      .sort((a, b) => a[1][0].areaOrder - b[1][0].areaOrder || b[1].length - a[1].length)
    
    const morningAttractions = []
    const eveningAttractions = []
    
    sortedAreas.forEach(([area, items]) => {
      items.forEach(item => {
        if (item.isNight) {
          eveningAttractions.push(item)
        } else {
          morningAttractions.push(item)
        }
      })
    })
    
    const dayAttractions = Array.from({ length: days }, () => [])
    const dayAreas = Array(days).fill(null)
    const dayAreaOrders = Array(days).fill(999)
    
    const assignAttractions = (attrList) => {
      for (const item of attrList) {
        let bestDay = -1
        let bestScore = Infinity
        
        for (let d = 0; d < days; d++) {
          if (dayAttractions[d].length >= MAX_ATTRACTIONS_PER_DAY) continue
          
          let score = dayAttractions[d].length * 10
          
          if (dayAreaOrders[d] < item.areaOrder) {
            score += 100
          }
          
          if (dayAreas[d] === item.area) {
            score -= 20
          } else if (dayAreas[d] === null) {
            score -= 5
          }
          
          if (score < bestScore) {
            bestScore = score
            bestDay = d
          }
        }
        
        if (bestDay === -1) {
          let minCount = MAX_ATTRACTIONS_PER_DAY
          for (let d = 0; d < days; d++) {
            if (dayAttractions[d].length < minCount) {
              minCount = dayAttractions[d].length
              bestDay = d
            }
          }
        }
        
        if (bestDay !== -1) {
          dayAttractions[bestDay].push(item)
          if (dayAreas[bestDay] === null) {
            dayAreas[bestDay] = item.area
            dayAreaOrders[bestDay] = item.areaOrder
          }
        }
      }
    }
    
    assignAttractions(morningAttractions)
    assignAttractions(eveningAttractions)
    
    const getFoodByArea = (dayIndex, area) => {
      const foodResult = []
      mealTypes.forEach(meal => {
        const allSpots = foodData[meal] || []
        const matchingSpots = allSpots.filter(spot => spot.area === area)
        const fallbackSpots = allSpots.filter(spot => spot.area !== area)
        const spots = matchingSpots.length > 0 ? matchingSpots : fallbackSpots
        const spot = spots.length > 0 ? spots[dayIndex % spots.length] : null
        if (spot) foodResult.push({ ...spot, mealType: meal })
      })
      return foodResult
    }
    
    for (let i = 0; i < days; i++) {
      const dayItems = dayAttractions[i]
      const dayArea = dayAreas[i]
      
      const nightItems = dayItems.filter(a => a.isNight)
      const dayItemsOnly = dayItems.filter(a => !a.isNight)
      
      const morning = addTransportToItems(dayItemsOnly.slice(0, Math.min(2, dayItemsOnly.length)).map((a, idx) => ({ ...a, slot: 'morning', idx })))
      const afternoon = addTransportToItems(dayItemsOnly.slice(Math.min(2, dayItemsOnly.length)).map((a, idx) => ({ ...a, slot: 'afternoon', idx })))
      const evening = addTransportToItems(nightItems.map((a, idx) => ({ ...a, slot: 'evening', idx })))
      
      const dayFood = getFoodByArea(i, dayArea)
      
      result.push({ 
        day: i + 1, 
        morning, 
        afternoon,
        evening,
        food: dayFood,
        area: dayArea
      })
    }
    return result
  }

  const routeByDays = routeData || groupByDays()

  const isItineraryEmpty = routeByDays.every(
    day => day.morning.length === 0 && day.afternoon.length === 0 && (!day.evening || day.evening.length === 0)
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
    const filteredItems = newData[dayIndex][slot].filter((_, i) => i !== itemIdx)
    newData[dayIndex] = {
      ...newData[dayIndex],
      [slot]: addTransportToItems(filteredItems)
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
    const slotItems = [...newData[dayIndex][slot]]
    const newItem = { ...attraction, slot, idx: slotItems.length }
    newItem.transportToNext = null
    slotItems.push(newItem)

    const updatedItems = addTransportToItems(slotItems)
    
    newData[dayIndex] = {
      ...newData[dayIndex],
      [slot]: updatedItems
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
    const isEmpty = dayData.morning.length === 0 && dayData.afternoon.length === 0 && (!dayData.evening || dayData.evening.length === 0)
    
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
              <SortableContext
                items={dayData.morning.map(a => a.id)}
                strategy={verticalListSortingStrategy}
              >
                {dayData.morning.map((attraction, index) => (
                  <SortableItem key={attraction.id} id={attraction.id}>
                    <div className="route-item attraction">
                      <span className="drag-handle">⋮⋮</span>
                      <span className="route-number">{index + 1}</span>
                      <div className="attraction-content">
                        <span className="route-name">{attraction.name}</span>
                        {attraction.transportToNext && (
                          <span className="transport-info">
                            {attraction.transportToNext.type === 'walk' && '🚶 '}
                            {attraction.transportToNext.type === 'metro' && '🚇 '}
                            {attraction.transportToNext.type === 'taxi' && '🚕 '}
                            {attraction.transportToNext.duration}
                          </span>
                        )}
                      </div>
                      <div className="item-actions">
                        <button className="remove-btn" onClick={() => removeAttraction(dayIndex, 'morning', index)}>×</button>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
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
              <SortableContext
                items={dayData.afternoon.map(a => a.id)}
                strategy={verticalListSortingStrategy}
              >
                {dayData.afternoon.map((attraction, index) => (
                  <SortableItem key={attraction.id} id={attraction.id}>
                    <div className="route-item attraction">
                      <span className="drag-handle">⋮⋮</span>
                      <span className="route-number">{dayData.morning.length + index + 1}</span>
                      <div className="attraction-content">
                        <span className="route-name">{attraction.name}</span>
                        {attraction.transportToNext && (
                          <span className="transport-info">
                            {attraction.transportToNext.type === 'walk' && '🚶 '}
                            {attraction.transportToNext.type === 'metro' && '🚇 '}
                            {attraction.transportToNext.type === 'taxi' && '🚕 '}
                            {attraction.transportToNext.duration}
                          </span>
                        )}
                      </div>
                      <div className="item-actions">
                        <button className="remove-btn" onClick={() => removeAttraction(dayIndex, 'afternoon', index)}>×</button>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
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

          {dayData.evening && dayData.evening.length > 0 && (
            <div className="time-slot">
              <div className="time-label evening">Evening</div>
              {dayData.evening.map((attraction, index) => (
                <div key={`e-${index}`} className="route-item attraction">
                  <span className="route-bullet">🌙</span>
                  <div className="attraction-content">
                    <span className="route-name">{attraction.name}</span>
                    {attraction.transportToNext && (
                      <span className="transport-info">
                        {attraction.transportToNext.type === 'walk' && '🚶 '}
                        {attraction.transportToNext.type === 'metro' && '🚇 '}
                        {attraction.transportToNext.type === 'taxi' && '🚕 '}
                        {attraction.transportToNext.duration}
                      </span>
                    )}
                  </div>
                  <div className="item-actions">
                    <button className="remove-btn" onClick={() => removeAttraction(dayIndex, 'evening', index)}>×</button>
                  </div>
                </div>
              ))}
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
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
      </DndContext>

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

      <RouteMap dayData={routeByDays[currentDay]} currentDay={currentDay} />
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
