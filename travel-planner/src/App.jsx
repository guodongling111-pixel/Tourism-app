import React, { useState, useEffect, useRef } from 'react'
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
    Xiamen: [24.4798, 118.0894],
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
    { id: 1, name: 'Yu Garden (豫园)', description: '古风出片地，汉服爱好者必冲📿', priority: 'high', area: 'Huangpu', category: 'attractions', label: '📸 出片', lat: 31.2278, lng: 121.4921 },
    { id: 2, name: 'The Bund (外滩)', description: '魔都C位，夜景绝美 🌃', priority: 'high', area: 'Huangpu', category: 'attractions', label: '🌃 地标', lat: 31.2408, lng: 121.4901 },
    { id: 3, name: 'Jing\'an Temple (静安寺)', description: '闹市祈福，超灵验🙏', priority: 'high', area: 'Jing\'an', category: 'attractions', label: '🙏 祈福', lat: 31.2286, lng: 121.4458 },
    { id: 4, name: 'Tianzhu Church (天主教堂)', description: '法式浪漫教堂，超级出片💒', priority: 'medium', area: 'Xuhui', category: 'attractions', label: '💒 出片', lat: 31.2061, lng: 121.4329 },
    { id: 5, name: 'Lujiazui (陆家嘴)', description: '魔都天际线，CBD大片 📸', priority: 'medium', area: 'Pudong', category: 'attractions', label: '📸 打卡', lat: 31.2203, lng: 121.5356 },
    { id: 6, name: 'Wukang Road (武康路)', description: '梧桐树下的浪漫街区🚶', priority: 'high', area: 'Xuhui', category: 'citywalk', label: '🚶 扫街', lat: 31.2089, lng: 121.4361 },
    { id: 7, name: 'Former French Concession', description: '超浪漫的法租界，超适合拍照📸', priority: 'high', area: 'Xuhui', category: 'citywalk', label: '📸 出片', lat: 31.2043, lng: 121.4482 },
    { id: 8, name: 'Xintiandi (新天地)', description: '石库门改造的潮流地标✨', priority: 'high', area: 'Huangpu', category: 'citywalk', label: '✨ 潮流', lat: 31.2184, lng: 121.4811 },
    { id: 9, name: 'West Huangpu Rd (西黄浦路)', description: '沿江复古建筑，超有氛围📸', priority: 'medium', area: 'Huangpu', category: 'citywalk', label: '📸 出片', lat: 31.2324, lng: 121.4872 },
    { id: 10, name: 'Xujiahui (徐家汇)', description: '超好逛的商圈，买买买🛍️', priority: 'low', area: 'Xuhui', category: 'citywalk', label: '🛍️ 逛街', lat: 31.2004, lng: 121.4334 },
    { id: 11, name: 'Seesaw Coffee (见闻咖啡)', description: 'ins风咖啡馆，出片神器☕', priority: 'high', area: 'Jing\'an', category: 'cafe', label: '☕ 打卡', lat: 31.2234, lng: 121.4478 },
    { id: 12, name: 'Manner Coffee', description: '性价比神咖啡，便宜好喝☕', priority: 'high', area: 'Xuhui', category: 'cafe', label: '☕ 咖啡', lat: 31.2078, lng: 121.4412 },
    { id: 13, name: 'Peet\'s Coffee (皮爷咖啡)', description: '复古美式咖啡，超有质感☕', priority: 'medium', area: 'Xuhui', category: 'cafe', label: '☕ 咖啡', lat: 31.2099, lng: 121.4501 },
    { id: 14, name: 'Huangpu River Night Cruise', description: '黄浦江夜游，绝美灯光秀🌃', priority: 'high', area: 'Huangpu', category: 'photo', label: '🌃 夜景', lat: 31.2389, lng: 121.5012 },
    { id: 15, name: 'Nanjing Road (南京路)', description: '超好逛的商业街，买买买🛍️', priority: 'medium', area: 'Huangpu', category: 'shopping', label: '🛍️ 逛街', lat: 31.2297, lng: 121.4809 },
    { id: 16, name: 'Wuzhen (乌镇)', description: '水乡古镇，汉服拍照圣地📸', priority: 'medium', area: 'Tongxiang', category: 'citywalk', label: '📸 出片', lat: 30.7421, lng: 120.4932 },
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
  Xiamen: [
    { id: 1, name: '鼓浪屿', description: '世界文化遗产，钢琴之岛', priority: 'high', area: '鼓浪屿', category: 'attractions', label: '🏛️ 景点', lat: 24.4333, lng: 118.0650 },
    { id: 2, name: '双子塔', description: '厦门地标建筑', priority: 'high', area: '思明', category: 'attractions', label: '🏛️ 地标', lat: 24.4790, lng: 118.0890 },
    { id: 3, name: '环岛路白城沙滩', description: '美丽海岸线', priority: 'medium', area: '思明', category: 'attractions', label: '🏖️ 沙滩', lat: 24.4360, lng: 118.1100 },
    { id: 4, name: '菽庄花园', description: '鼓浪屿上的江南园林', priority: 'medium', area: '鼓浪屿', category: 'attractions', label: '🌳 园林', lat: 24.4420, lng: 118.0630 },
    { id: 5, name: '植物园', description: '闯入现实版绿野仙踪，雨林喷雾丁达尔光，多肉区仙人掌王国', priority: 'high', area: '思明', category: 'attractions', label: '🌿 森系秘境', lat: 24.4425, lng: 118.1025 },
    { id: 6, name: '钟鼓索道', description: '40分钟高空飞驰，左手山城，右手大海，红蓝绿吊箱超好拍', priority: 'high', area: '思明', category: 'attractions', label: '🚡 高空视角', lat: 24.4875, lng: 118.1195 },
    { id: 7, name: '厦门大学', description: '依山傍海的百年学府，芙蓉湖有天鹅，芙蓉隧道涂鸦超多', priority: 'high', area: '思明', category: 'attractions', label: '🎓 文艺校园', lat: 24.4348, lng: 118.1006 },
    { id: 8, name: '嘉庚公园', description: '红砖白石的嘉庚建筑，中西合璧，还能在海边玩沙、赶海', priority: 'medium', area: '集美', category: 'attractions', label: '🏖️ 海边散步', lat: 24.5720, lng: 118.0960 },
    { id: 9, name: '十里长堤', description: '看橘子海日落，追海上列车，吹着海风，氛围感拉满', priority: 'high', area: '集美', category: 'attractions', label: '🌅 日落必去', lat: 24.5680, lng: 118.0985 },
    { id: 10, name: '集美学村', description: '嘉庚建筑群，文艺烟火气，还能坐海上地铁，看浪漫日落', priority: 'high', area: '集美', category: 'attractions', label: '🚇 海上地铁', lat: 24.5668, lng: 118.0968 },
    { id: 11, name: '园博苑', description: '免费的异国风情园林，可乘小火车，还能邂逅黑天鹅', priority: 'medium', area: '集美', category: 'attractions', label: '🌍 异国园林', lat: 24.5510, lng: 118.0880 },
    { id: 12, name: '龙舟池', description: '嘉庚建筑与五球装置碰撞，红砖绿瓦，夜景灯光秀超梦幻', priority: 'medium', area: '集美', category: 'attractions', label: '🌃 夜景灯光', lat: 24.5705, lng: 118.0945 },
    { id: 13, name: '黄厝沙滩', description: '本地人私藏的看日出圣地，沙质细腻，人相对较少', priority: 'medium', area: '思明', category: 'attractions', label: '🌄 小众日出', lat: 24.4502, lng: 118.1448 },
    { id: 14, name: '山海健康步道', description: '穿越城市森林的空中走廊，可以欣赏海景和城市风光', priority: 'medium', area: '思明', category: 'attractions', label: '🌿 城市徒步', lat: 24.4605, lng: 118.1050 },
    { id: 15, name: '沙坡尾', description: '艺术西区→大学路→避风坞→顶澳仔猫街', priority: 'high', area: '思明', category: 'citywalk', label: '🚶 Citywalk', lat: 24.4615, lng: 118.0920 },
    { id: 16, name: '幸福路文创街区', description: '文艺街区', priority: 'high', area: '思明', category: 'citywalk', label: '🚶 Citywalk', lat: 24.4620, lng: 118.0930 },
    { id: 17, name: '顶澳仔猫街', description: '猫主题街区', priority: 'high', area: '思明', category: 'citywalk', label: '🐱 猫街', lat: 24.4630, lng: 118.0910 },
    { id: 18, name: '转角合作社日系斑马线', description: '日系拍照点', priority: 'medium', area: '思明', category: 'photo', label: '📸 出片', lat: 24.4625, lng: 118.0925 },
    { id: 19, name: '查查斯门头', description: '拍照打卡点', priority: 'medium', area: '思明', category: 'photo', label: '📸 出片', lat: 24.4610, lng: 118.0910 },
    { id: 20, name: '幸福路买手店 & 杂货铺', description: '买手店杂货铺', priority: 'medium', area: '思明', category: 'shopping', label: '🛍️ 逛街', lat: 24.4620, lng: 118.0930 },
  ],
}

const FOOD_SPOTS = {
  Shanghai: {
    Breakfast: [
      { id: 1, name: 'Manner Coffee', type: 'Specialty Coffee', area: 'Xuhui', tags: ['popular', 'instagram'] },
      { id: 2, name: 'Seesaw Coffee', type: 'Specialty Coffee', area: 'Jing\'an', tags: ['popular', 'coffee expert'] },
      { id: 3, name: 'Egg Drop', type: 'Sandwich', area: 'Huangpu', tags: ['viral', 'local favorite'] },
      { id: 4, name: 'Lost Bakery', type: 'Bakery', area: 'Xuhui', tags: ['popular', 'photo spot'] },
      { id: 5, name: 'B Specification', type: 'Toast', area: 'Xuhui', tags: ['local favorite'] },
      { id: 6, name: 'Morning Sleep', type: 'Brunch', area: 'Huangpu', tags: ['cozy'] },
    ],
    Lunch: [
      { id: 4, name: 'Haidilao (海底捞)', type: 'Hotpot', area: 'Xuhui', tags: ['popular', 'service'] },
      { id: 5, name: 'Lost Bakery', type: 'Bistro', area: 'Xuhui', tags: ['local favorite'] },
      { id: 6, name: 'Shenzhen Lu (深圳路)', type: 'Dim Sum', area: 'Huangpu', tags: ['local favorite', 'traditional'] },
    ],
    Dinner: [
      { id: 7, name: 'Ultraviolet by Paul Pairet', type: 'Fine Dining', area: 'Huangpu', tags: ['米其林', 'photo spot'] },
      { id: 8, name: 'Fu He (福和)', type: 'Chinese Fusion', area: 'Xuhui', tags: ['popular', 'creative'] },
      { id: 9, name: 'The Cannery', type: 'Seafood', area: 'Huangpu', tags: ['cozy', 'photo spot'] },
    ],
  },
  Tokyo: {
    Breakfast: [
      { id: 1, name: 'Blue Bottle Coffee', type: 'Cafe', area: 'Omotesando', tags: ['popular', 'instagram'] },
      { id: 2, name: 'Komeda Coffee', type: 'Coffee Shop', area: 'Shibuya', tags: ['traditional', 'local favorite'] },
      { id: 3, name: 'Lawson Store', type: 'Convenience', area: 'Various', tags: ['budget', 'local favorite'] },
      { id: 4, name: 'Sarabeth\'s', type: 'Brunch', area: 'Omotesando', tags: ['popular', 'photo spot'] },
      { id: 5, name: 'Eggoman', type: 'Sandwich', area: 'Shibuya', tags: ['viral', 'local favorite'] },
      { id: 6, name: 'B的外', type: 'Toast', area: 'Shibuya', tags: ['popular'] },
    ],
    Lunch: [
      { id: 4, name: 'Ichiran Ramen', type: 'Ramen', area: 'Shibuya', tags: ['popular', 'local favorite'] },
      { id: 5, name: 'Maisen', type: 'Tonkatsu', area: 'Shibuya', tags: ['popular', 'traditional'] },
      { id: 6, name: 'Gyukatsu Motomura', type: 'Beef Cutlet', area: 'Shibuya', tags: ['viral', 'photo spot'] },
    ],
    Dinner: [
      { id: 7, name: 'Tsukiji Sushi', type: 'Sushi', area: 'Tsukiji', tags: ['米其林', 'traditional'] },
      { id: 8, name: 'Ushiya', type: 'BBQ', area: 'Shibuya', tags: ['popular', 'local favorite'] },
      { id: 9, name: 'Gontran Cherrier', type: 'Bakery', area: 'Shibuya', tags: ['popular', 'photo spot'] },
    ],
  },
  Paris: {
    Breakfast: [
      { id: 1, name: 'Café de Flore', type: 'Coffee Shop', area: 'Saint-Germain', tags: ['historic', 'photo spot'] },
      { id: 2, name: 'Du Pain et des Idées', type: 'Bakery', area: 'Canal Saint-Martin', tags: ['popular', 'local favorite'] },
      { id: 3, name: 'La Maison Sans Gluten', type: 'Cafe', area: 'Le Marais', tags: ['healthy', 'instagram'] },
      { id: 4, name: 'Ten Belles', type: 'Brunch', area: 'Canal Saint-Martin', tags: ['popular', 'coffee expert'] },
      { id: 5, name: 'Kauder', type: 'Bakery', area: 'Le Marais', tags: ['local favorite', 'traditional'] },
      { id: 6, name: 'Café Merlin', type: 'Cafe', area: 'Montparnasse', tags: ['cozy', 'historic'] },
    ],
    Lunch: [
      { id: 4, name: 'Breizh Café', type: 'Crepes', area: 'Marais', tags: ['popular', 'local favorite'] },
      { id: 5, name: 'Le Comptoir du Panthéon', type: 'Bistro', area: 'Latin Quarter', tags: ['traditional', 'cozy'] },
      { id: 6, name: 'Café Martini', type: 'Bistro', area: 'Montparnasse', tags: ['local favorite'] },
    ],
    Dinner: [
      { id: 7, name: 'L\'Ambroisie', type: 'French Fine Dining', area: 'Place Vendôme', tags: ['米其林', 'romantic'] },
      { id: 8, name: 'Le Cinq', type: 'French', area: 'George V', tags: ['米其林', 'popular'] },
      { id: 9, name: 'Bouillon Chartier', type: 'French', area: 'Grand Boulevard', tags: ['local favorite', 'budget'] },
    ],
  },
  'New York': {
    Breakfast: [
      { id: 1, name: 'Blue Bottle Coffee', type: 'Cafe', area: 'Brooklyn', tags: ['popular', 'instagram'] },
      { id: 2, name: 'Joe\'s Coffee', type: 'Coffee Shop', area: 'West Village', tags: ['local favorite', 'cozy'] },
      { id: 3, name: 'Clinton Street Baking', type: 'Bakery', area: 'Lower East Side', tags: ['popular', 'photo spot'] },
    ],
    Lunch: [
      { id: 4, name: 'Katz\'s Delicatessen', type: 'Deli', area: 'Lower East Side', tags: ['historic', 'local favorite'] },
      { id: 5, name: 'Joe\'s Pizza', type: 'Pizza', area: 'Greenwich Village', tags: ['popular', 'budget'] },
      { id: 6, name: 'Shake Shack', type: 'Burger', area: 'Madison Square', tags: ['popular', 'viral'] },
    ],
    Dinner: [
      { id: 7, name: 'Le Bernardin', type: 'Seafood', area: 'Midtown', tags: ['米其林', 'popular'] },
      { id: 8, name: 'Carbone', type: 'Italian', area: 'West Village', tags: ['popular', 'photo spot'] },
      { id: 9, name: 'Keens', type: 'Steakhouse', area: 'Garment District', tags: ['historic', 'traditional'] },
    ],
  },
  London: {
    Breakfast: [
      { id: 1, name: 'Monmouth Coffee', type: 'Coffee', area: 'Borough', tags: ['popular', 'coffee expert'] },
      { id: 2, name: 'The Coal Shed', type: 'Full English', area: 'Tower Bridge', tags: ['traditional', 'local favorite'] },
      { id: 3, name: 'Flat Iron', type: 'Cafe', area: 'Covent Garden', tags: ['popular', 'budget'] },
    ],
    Lunch: [
      { id: 4, name: 'Dishoom', type: 'Indian', area: 'Covent Garden', tags: ['popular', 'local favorite'] },
      { id: 5, name: 'Borough Market', type: 'Market Food', area: 'Southwark', tags: ['local favorite', 'vibrant'] },
      { id: 6, name: 'Brick Lane Curry', type: 'Indian', area: 'Brick Lane', tags: ['traditional', 'budget'] },
    ],
    Dinner: [
      { id: 7, name: 'The Ledbury', type: 'Fine Dining', area: 'Notting Hill', tags: ['米其林', 'romantic'] },
      { id: 8, name: 'The Harwood Arms', type: 'Pub', area: 'Fulham', tags: ['popular', 'local favorite'] },
      { id: 9, name: 'The Wolseley', type: 'European', area: 'Piccadilly', tags: ['classic', 'photo spot'] },
    ],
  },
  Rome: {
    Breakfast: [
      { id: 1, name: 'Sant\'Eustachio Il Caffè', type: 'Coffee', area: 'Piazza di Sant\'Eustachio', tags: ['historic', 'local favorite'] },
      { id: 2, name: 'Roscioli', type: 'Cafe', area: 'Campo de\' Fiori', tags: ['popular', 'instagram'] },
      { id: 3, name: 'Piazza Madonna', type: 'Bar', area: 'Centro Storico', tags: ['cozy', 'traditional'] },
    ],
    Lunch: [
      { id: 4, name: 'Pizzarium', type: 'Pizza al Taglio', area: 'Trastevere', tags: ['popular', 'viral'] },
      { id: 5, name: 'Da Enzo al 29', type: 'Trattoria', area: 'Trastevere', tags: ['local favorite', 'traditional'] },
      { id: 6, name: 'Roscioli Salumeria', type: 'Cured Meats', area: 'Campo de\' Fiori', tags: ['popular', 'photo spot'] },
    ],
    Dinner: [
      { id: 7, name: 'Il Pagliaccio', type: 'Fine Dining', area: 'Centro Storico', tags: ['米其林', 'romantic'] },
      { id: 8, name: 'Trattoria da Danilo', type: 'Trattoria', area: 'Testaccio', tags: ['local favorite', 'traditional'] },
      { id: 9, name: 'Giolitti', type: 'Gelato', area: 'Centro Storico', tags: ['popular', 'photo spot'] },
    ],
  },
  default: {
    Breakfast: [
      { id: 1, name: 'Corner Cafe', type: 'Coffee', area: 'Downtown', tags: ['popular'] },
      { id: 2, name: 'Bakery House', type: 'Bakery', area: 'City Center', tags: ['local favorite'] },
      { id: 3, name: 'Morning Bistro', type: 'Brunch', area: 'Downtown', tags: ['cozy'] },
      { id: 4, name: 'Toast House', type: 'Toast', area: 'City Center', tags: ['popular'] },
      { id: 5, name: 'Local Diner', type: 'Light Meal', area: 'Downtown', tags: ['budget'] },
    ],
    Lunch: [
      { id: 3, name: 'Local Bistro', type: 'Casual', area: 'City Center', tags: ['local favorite'] },
      { id: 4, name: 'Food Court', type: 'Various', area: 'Mall', tags: ['budget', 'variety'] },
    ],
    Dinner: [
      { id: 5, name: 'Restaurant Bell', type: 'Fine Dining', area: 'City Center', tags: ['romantic'] },
      { id: 6, name: 'Family Restaurant', type: 'Casual', area: 'Downtown', tags: ['cozy', 'budget'] },
    ],
  },
  Xiamen: {
    Breakfast: [
      { id: 1, name: 'Ensemble191', type: '咖啡馆', area: '沙坡尾', tags: ['文艺', '打卡'] },
      { id: 2, name: '向日葵之家', type: '咖啡馆', area: '沙坡尾', tags: ['温馨', '拍照'] },
      { id: 3, name: '小曾咖啡', type: '咖啡馆', area: '思明', tags: ['社区店'] },
      { id: 4, name: 'JUICY bakery', type: '面包店', area: '思明', tags: ['网红'] },
      { id: 5, name: '澜今烘焙', type: '烘焙', area: '思明', tags: ['烘焙', '甜品'] },
      { id: 6, name: '野鹿甜点铺', type: '甜品店', area: '思明', tags: ['文艺'] },
      { id: 7, name: '茉莉奶白', type: '奶茶', area: '思明', tags: ['奶茶', '网红'] },
    ],
    Lunch: [
      { id: 7, name: '乌堂沙茶面', type: '沙茶面', area: '中山路', tags: ['本地特色'] },
      { id: 8, name: '芋包嫂', type: '小吃', area: '中山路', tags: ['传统'] },
      { id: 9, name: '百万万汉堡', type: '汉堡', area: '沙坡尾', tags: ['网红', '打卡'] },
    ],
    Dinner: [
      { id: 10, name: 'JOJO刨冰', type: '甜品', area: '沙坡尾', tags: ['网红'] },
      { id: 11, name: '吸客本土奶茶', type: '奶茶', area: '思明', tags: ['本地品牌'] },
    ],
  },
}

const CITIES = ['Shanghai', 'Tokyo', 'Paris', 'New York', 'London', 'Rome', 'Xiamen']

const cityMap = {
  Shanghai: '上海',
  Tokyo: '东京',
  Paris: '巴黎',
  'New York': '纽约',
  London: '伦敦',
  Rome: '罗马',
  Xiamen: '厦门',
}

function StepIndicator({ currentStep }) {
  const steps = ['目的地', '必打卡清单', '我的行程']
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
      <h2>开启你的心动之旅 ✨</h2>
      <div className="form-group">
        <label>想去哪个城市逛吃？</label>
        <select value={city} onChange={(e) => { setCity(e.target.value); setCustomCity(''); }}>
          <option value="">解锁宝藏城市 📍</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{cityMap[c]}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>或者私藏一个神仙地～</label>
        <input
          type="text"
          placeholder="偷偷输入想去的角落"
          value={customCity}
          onChange={(e) => { setCustomCity(e.target.value); setCity(''); }}
        />
      </div>
      <div className="form-group">
        <label>逛吃天数设定 📅</label>
        <input
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
      </div>
      <button className="btn-primary" onClick={handleSubmit} disabled={!isValid}>
        选好啦，出发 ✨
      </button>
    </div>
  )
}

function AttractionSelection({ city, days, onNext, onBack }) {
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [xhsInput, setXhsInput] = useState('')
  const [xhsCustomItems, setXhsCustomItems] = useState([])

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

  const parseXiaohongshu = (text) => {
    try {
      if (!text || text.trim() === '') {
        setError('Please paste some content first')
        return
      }

      const allAttractions = Object.values(ATTRACTIONS).flat()
      
      if (text.includes('→') || text.includes('->')) {
        const places = text.split(/→|->/).map(p => p.trim()).filter(Boolean)
        
        const morning = []
        const afternoon = []
        const evening = []
        
        places.forEach((loc, idx) => {
          const cleaned = loc.trim()
          if (!cleaned || cleaned.length < 2) return
          
          const matched = allAttractions.find(attr => {
            const chineseNames = attr.name.match(/[\u4e00-\u9fa5]+/g) || []
            return chineseNames.some(cn => cleaned.includes(cn)) ||
                   cleaned.toLowerCase().includes(attr.name.split(' ')[0].toLowerCase())
          })
          
          if (matched) {
            const item = { ...matched, source: 'known' }
            if (places.length >= 4) {
              if (idx < 2) morning.push(item)
              else if (idx < places.length - 1) afternoon.push(item)
              else evening.push(item)
            } else if (places.length === 3) {
              if (idx === 0) morning.push(item)
              else if (idx === 1) afternoon.push(item)
              else evening.push(item)
            } else if (places.length === 2) {
              if (idx === 0) morning.push(item)
              else afternoon.push(item)
            }
          } else {
            const chineseMatch = cleaned.match(/[\u4e00-\u9fa5]{2,}/g)
            if (chineseMatch) {
              chineseMatch.forEach(cn => {
                const customItem = {
                  id: `custom-${Date.now()}-${Math.random()}`,
                  name: cn,
                  description: 'Custom location',
                  priority: 'medium',
                  area: 'Custom',
                  category: 'citywalk',
                  label: '📍 Custom',
                  source: 'custom',
                  lat: null,
                  lng: null
                }
                if (places.length >= 4) {
                  if (idx < 2) morning.push(customItem)
                  else if (idx < places.length - 1) afternoon.push(customItem)
                  else evening.push(customItem)
                } else if (places.length === 3) {
                  if (idx === 0) morning.push(customItem)
                  else if (idx === 1) afternoon.push(customItem)
                  else evening.push(customItem)
                } else if (places.length === 2) {
                  if (idx === 0) morning.push(customItem)
                  else afternoon.push(customItem)
                }
              })
            }
          }
        })
        
        if (morning.length === 0 && afternoon.length === 0 && evening.length === 0) {
          setError('No valid travel info found')
          return
        }
        
        const result = [{
          day: 1,
          morning: morning.map((a, i) => ({ ...a, idx: i })),
          afternoon: afternoon.map((a, i) => ({ ...a, idx: i })),
          evening: evening.map((a, i) => ({ ...a, idx: i })),
          food: []
        }]
        
        setSelected([])
        setXhsCustomItems([])
        setXhsInput('')
        setError('')
        
        onNext(result, true)
        return
      }
      
      const lines = text.split(/\n+/)
      const result = []
      
      lines.forEach(line => {
        const trimmed = line.trim()
        if (!trimmed) return
        
        const match = trimmed.match(/Day(\d+)/)
        const dayNum = match ? parseInt(match[1]) : null
        
        const parts = trimmed.split("：")
        const content = parts.length > 1 ? parts[1] : (parts[0].split(/Day\d+/)[1] || parts[0])
        
        const locations = content.split(/\s+/).filter(l => l.trim())
        
        const morning = []
        const afternoon = []
        const evening = []
        
        locations.forEach((loc, idx) => {
          const cleaned = loc.trim()
          if (!cleaned || cleaned.length < 2) return
          
          const matched = allAttractions.find(attr => {
            const chineseNames = attr.name.match(/[\u4e00-\u9fa5]+/g) || []
            return chineseNames.some(cn => cleaned.includes(cn)) ||
                   cleaned.toLowerCase().includes(attr.name.split(' ')[0].toLowerCase())
          })
          
          if (matched) {
            const item = { ...matched, source: 'known', originalName: cleaned }
            if (idx < 2) morning.push(item)
            else if (idx < locations.length - 1) afternoon.push(item)
            else evening.push(item)
          } else {
            const chineseMatch = cleaned.match(/[\u4e00-\u9fa5]{2,}/g)
            if (chineseMatch) {
              chineseMatch.forEach(cn => {
                const customItem = {
                  id: `custom-${Date.now()}-${Math.random()}`,
                  name: cn,
                  description: 'Custom location',
                  priority: 'medium',
                  area: 'Custom',
                  category: 'citywalk',
                  label: '📍 Custom',
                  source: 'custom',
                  lat: null,
                  lng: null
                }
                if (idx < 2) morning.push(customItem)
                else if (idx < locations.length - 1) afternoon.push(customItem)
                else evening.push(customItem)
              })
            }
          }
        })
        
        if (morning.length > 0 || afternoon.length > 0 || evening.length > 0) {
          result.push({
            day: dayNum || result.length + 1,
            morning: morning.map((a, i) => ({ ...a, idx: i })),
            afternoon: afternoon.map((a, i) => ({ ...a, idx: i })),
            evening: evening.map((a, i) => ({ ...a, idx: i })),
            food: []
          })
        }
      })
      
      if (result.length === 0) {
        setError('No valid travel info found')
        return
      }
      
      console.log("parsed days:", result)
      
      while (result.length < days) {
        result.push({ day: result.length + 1, morning: [], afternoon: [], evening: [], food: [] })
      }
      
      setSelected([])
      setXhsCustomItems([])
      setXhsInput('')
      setError('')
      
      const hasUserOrder = /morning|afternoon|evening|上午|下午|晚上/i.test(text)
      onNext(result, hasUserOrder)
    } catch (err) {
      console.error("parse error:", err)
      setError('Parsing failed: ' + err.message)
    }
  }

  const handleSubmit = () => {
    const selectedAttractions = attractions.filter((a) => selected.includes(a.id))
    console.log('Selected attractions:', selectedAttractions)
    
    if (selectedAttractions.length === 0 && xhsCustomItems.length === 0) {
      alert('Please select at least 1 attraction')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const dayData = [{ day: 1, attractions: [...selectedAttractions, ...xhsCustomItems] }]
      onNext(dayData, false)
      setLoading(false)
    }, 800)
  }

  return (
    <div className="page">
      <h2>挑出你的必打卡清单</h2>
      <p className="subtitle">{cityMap[city] || city} - {days} 天</p>
      
      <div className="xhs-import">
        <div className="xhs-header">
          <span className="xhs-icon">📕</span>
          <span className="xhs-title">💥 抄小红书爆款作业</span>
        </div>
        <textarea
          className="xhs-textarea"
          placeholder="粘贴笔记链接或文案"
          value={xhsInput}
          onChange={(e) => setXhsInput(e.target.value)}
        />
        <button className="btn-primary xhs-btn" onClick={() => parseXiaohongshu(xhsInput)}>
          一键生成行程 🍓
        </button>
        {error && <p className="xhs-error">{error}</p>}
      </div>
      
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
        <button className="btn-secondary" onClick={onBack}>返回</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? '生成中...' : '生成路线 ✨'}
        </button>
      </div>
    </div>
  )
}

const CATEGORY_CONFIG = {
  attractions: { icon: '🏛️', name: '景点打卡', color: '#3b82f6' },
  citywalk: { icon: '🚶', name: 'citywalk', color: '#10b981' },
  cafe: { icon: '☕', name: '咖啡馆', color: '#92400e' },
  photo: { icon: '📸', name: '出片地', color: '#ec4899' },
  food: { icon: '🍜', name: '美食', color: '#f59e0b' },
  shopping: { icon: '🛍️', name: '逛街', color: '#8b5cf6' },
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
    <div ref={setNodeRef} style={style} {...attributes}>
      {children}
    </div>
  )
}

function RouteResult({ city, days, attractions, userDefinedOrder = false, onStartOver, onBack }) {
  const [currentDay, setCurrentDay] = useState(0)
  const [routeData, setRouteData] = useState(null)
  const [showAddModal, setShowAddModal] = useState(null)
  const [showFoodModal, setShowFoodModal] = useState(null)
  const [showRestFoodModal, setShowRestFoodModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [restDays, setRestDays] = useState(new Set())
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState(null)
  const foodData = FOOD_SPOTS[city] || FOOD_SPOTS.default

  const processedAttractions = React.useMemo(() => {
    if (!attractions || !Array.isArray(attractions)) return []
    if (attractions.length === 0) return []
    if (attractions[0] && attractions[0].morning !== undefined) {
      return attractions
    }
    if (attractions[0] && attractions[0].attractions !== undefined) {
      return attractions.flatMap(d => d.attractions || [])
    }
    return attractions
  }, [attractions])

  const restDayFoodData = {
    local: ["生煎包", "小笼包", "葱油拌面", "蟹粉拌面"],
    light: ["沙拉", "三明治", "轻食碗", "藜麦饭"],
    tea: ["喜茶", "奈雪", "茶百道", "一点点"]
  }

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

  useEffect(() => {
    console.log("useEffect running:", { userDefinedOrder, attractionsLength: attractions?.length })
    if (!attractions || !Array.isArray(attractions) || attractions.length === 0) return
    
    const firstItem = attractions[0]
    const hasSlotFormat = firstItem && firstItem.morning !== undefined
    console.log("hasSlotFormat:", hasSlotFormat)
    
    if (userDefinedOrder || hasSlotFormat) {
      const processedData = attractions.map(day => ({
        ...day,
        morning: day.morning || [],
        afternoon: day.afternoon || [],
        evening: day.evening || [],
        food: day.food && day.food.length > 0 ? day.food : [
          { mealType: 'Breakfast', name: null, type: null, area: null },
          { mealType: 'Lunch', name: null, type: null, area: null },
          { mealType: 'Dinner', name: null, type: null, area: null }
        ]
      }))
      console.log("setting routeData:", processedData)
      setRouteData(processedData)
    }
  }, [userDefinedOrder, attractions])

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
    if (!processedAttractions || processedAttractions.length === 0) return []
    
    const firstItem = processedAttractions[0]
    if (firstItem && firstItem.morning !== undefined) {
      return processedAttractions
    }
    
    const result = []
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner']
    
    const attractionsWithMeta = processedAttractions.map(a => ({
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
    
    const getFoodByArea = (dayIndex, area, allAttractions) => {
      const firstMorning = allAttractions[0]?.area
      const lastMorning = allAttractions[allAttractions.length - 1]?.area
      const eveningArea = dayAttractions[dayIndex].find(a => a.isNight)?.area

      const areas = {
        Breakfast: firstMorning || area,
        Lunch: lastMorning || firstMorning || area,
        Dinner: eveningArea || lastMorning || area
      }

      const foodResult = []
      mealTypes.forEach(meal => {
        const targetArea = areas[meal]
        const allSpots = foodData[meal] || []
        const matchingSpots = allSpots.filter(spot => spot.area === targetArea)
        const fallbackSpots = allSpots.filter(spot => spot.area !== targetArea)
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

      const dayFood = getFoodByArea(i, dayArea, morning)
      
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

  const getSegments = (dayData) => {
    const segments = []
    const places = []

    places.push({ name: 'Hotel', type: 'hotel', area: null })
    
    const breakfast = dayData.food?.find(f => f.mealType === 'Breakfast')
    if (breakfast) places.push({ name: breakfast.name, type: 'food', area: breakfast.area, mealType: 'Breakfast' })
    
    dayData.morning.forEach(a => places.push({ name: a.name, type: 'attraction', area: a.area }))
    
    const lunch = dayData.food?.find(f => f.mealType === 'Lunch')
    if (lunch) places.push({ name: lunch.name, type: 'food', area: lunch.area, mealType: 'Lunch' })
    
    dayData.afternoon.forEach(a => places.push({ name: a.name, type: 'attraction', area: a.area }))
    
    const dinner = dayData.food?.find(f => f.mealType === 'Dinner')
    if (dinner) places.push({ name: dinner.name, type: 'food', area: dinner.area, mealType: 'Dinner' })
    
    dayData.evening?.forEach(a => places.push({ name: a.name, type: 'attraction', area: a.area }))

    for (let i = 0; i < places.length - 1; i++) {
      const from = places[i]
      const to = places[i + 1]
      
      const sameArea = from.area && to.area && from.area === to.area
      const isWalk = sameArea
      const isMetro = !sameArea && Math.random() > 0.3
      
      let transportType, duration
      if (isWalk) {
        transportType = 'walk'
        duration = `${8 + Math.floor(Math.random() * 10)} min`
      } else if (isMetro) {
        transportType = 'metro'
        duration = `${15 + Math.floor(Math.random() * 15)} min`
      } else {
        transportType = 'taxi'
        duration = `${20 + Math.floor(Math.random() * 20)} min`
      }

      segments.push({
        from: from.name,
        to: to.name,
        type: transportType,
        duration
      })
    }

    return segments
  }

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

  const isDelivery = (foodItem) => foodItem?.type === 'delivery'

  const getFoodDisplay = (foodItem) => {
    if (!foodItem) return null
    if (foodItem.type === 'delivery') {
      return { icon: '🛵', name: foodItem.name, subtitle: 'Delivery' }
    }
    return { icon: foodItem.mealType === 'Breakfast' ? '🍳' : foodItem.mealType === 'Lunch' ? '🍜' : '🍽️', name: foodItem.name, subtitle: `${foodItem.type} • ${foodItem.area}` }
  }

  const removeAttraction = (dayIndex, time, index) => {
    const newData = routeByDays.map((day, i) => {
      if (i !== dayIndex) return day;
      const timeArray = day[time] || [];
      return {
        ...day,
        [time]: timeArray.filter((_, idx) => idx !== index)
      };
    });
    setRouteData(newData);
  };

  const replaceFood = (dayIndex, mealType) => {
    setShowFoodModal({ dayIndex, mealType })
  }

  const selectRestaurant = (restaurant) => {
    if (!showFoodModal) return
    const { dayIndex, mealType } = showFoodModal
    const currentFood = routeByDays[dayIndex].food
    
    const newData = [...routeByDays]
    newData[dayIndex] = {
      ...newData[dayIndex],
      food: currentFood.map(f => f.mealType === mealType ? { ...restaurant, mealType } : f)
    }
    setRouteData(newData)
    setShowFoodModal(null)
  }

  const selectDelivery = (deliveryName) => {
    if (!selectedMealType) return
    const dayIndex = showFoodModal?.dayIndex
    if (dayIndex === undefined) return
    
    const currentFood = routeByDays[dayIndex].food
    
    const newData = [...routeByDays]
    newData[dayIndex] = {
      ...newData[dayIndex],
      food: currentFood.map(f => f.mealType === selectedMealType ? { name: deliveryName, type: 'delivery', mealType: selectedMealType } : f)
    }
    setRouteData(newData)
    setShowDeliveryModal(false)
    setSelectedMealType(null)
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
    const segments = getSegments(dayData)
    
    return (
    <div className="day-card">
      <div className="day-header">
        <span>第{dayData.day}天</span>
      </div>
      
      {isRestDay ? (
        <div className="rest-day-content">
          <div className="rest-day-header">
            <span className="rest-day-icon">🛌</span>
            <span className="rest-day-title">Rest Day</span>
          </div>
          <p className="rest-day-subtitle">Take it easy today</p>
          
          <div className="rest-day-food">
            <div className="rest-food-item" onClick={() => { setSelectedCategory('local'); setShowRestFoodModal(true); }}>
              <span className="rest-food-icon">🍜</span>
              <span className="rest-food-name">Local Food</span>
            </div>
            <div className="rest-food-item" onClick={() => { setSelectedCategory('light'); setShowRestFoodModal(true); }}>
              <span className="rest-food-icon">🥗</span>
              <span className="rest-food-name">Light Meal</span>
            </div>
            <div className="rest-food-item" onClick={() => { setSelectedCategory('tea'); setShowRestFoodModal(true); }}>
              <span className="rest-food-icon">🧋</span>
              <span className="rest-food-name">Milk Tea</span>
            </div>
          </div>
          
          <button className="btn-secondary rest-day-toggle" onClick={() => toggleRestDay(dayIndex)}>Mark as Day with Plans</button>
        </div>
      ) : isEmpty ? (
        <div className="empty-day">
          <p className="empty-day-text">No places planned yet</p>
          <button className="add-btn" onClick={() => handleAddClick(dayIndex, 'morning')}>+ 加个打卡点</button>
          <button className="btn-secondary rest-day-btn" onClick={() => toggleRestDay(dayIndex)}>Mark as Rest Day</button>
        </div>
      ) : (
        <>
          <div className="day-segments">
            {segments.map((seg, idx) => (
              <div key={idx} className="segment-item">
                <span className="segment-from">{seg.from}</span>
                <span className="segment-arrow">
                  ↓ {seg.type === 'walk' ? '🚶' : seg.type === 'metro' ? '🚇' : '🚕'} {seg.duration}
                </span>
                <span className="segment-to">{seg.to}</span>
              </div>
            ))}
          </div>
          
          {dayData.food && dayData.food.find(f => f.mealType === 'Breakfast') && (
            <div className={`route-item food meal-breakfast`}>
              <span className="meal-icon">{isDelivery(getFoodByMealType(dayData.food, 'Breakfast')) ? '🛵' : '🍳'}</span>
              <div className="route-food-info">
                <span className="meal-label">早餐</span>
                <span className="route-name">{getFoodByMealType(dayData.food, 'Breakfast')?.name || '点个早餐吧'}</span>
                {getFoodByMealType(dayData.food, 'Breakfast')?.name && <span className="route-food-type">{isDelivery(getFoodByMealType(dayData.food, 'Breakfast')) ? '外卖' : `${getFoodByMealType(dayData.food, 'Breakfast').type} • ${getFoodByMealType(dayData.food, 'Breakfast').area}`}</span>}
              </div>
              <button className="edit-btn" onClick={() => replaceFood(dayIndex, 'Breakfast')}>↻</button>
            </div>
          )}
          
          <div className="time-slot">
            <div className="time-label morning">上午 · 刷街模式 🚶‍♀️</div>
            {dayData.morning.length === 0 ? (
              <div className="route-item empty-slot">
                <span className="route-name">躺平</span>
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
                        <span 
                          style={{ cursor: 'pointer', color: '#9ca3af', fontSize: '18px' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeAttraction(dayIndex, 'morning', index);
                            return false;
                          }}
                        >×</span>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            )}
            <button className="add-btn" onClick={() => handleAddClick(dayIndex, 'morning')}>+ 加个打卡点</button>
          </div>
          
          {dayData.food && dayData.food.find(f => f.mealType === 'Lunch') && (
            <div className={`route-item food meal-lunch`}>
              <span className="meal-icon">{isDelivery(getFoodByMealType(dayData.food, 'Lunch')) ? '🛵' : '🍜'}</span>
              <div className="route-food-info">
                <span className="meal-label">午餐</span>
                <span className="route-name">{getFoodByMealType(dayData.food, 'Lunch')?.name || '午餐吃什么呢'}</span>
                {getFoodByMealType(dayData.food, 'Lunch')?.name && <span className="route-food-type">{isDelivery(getFoodByMealType(dayData.food, 'Lunch')) ? '外卖' : `${getFoodByMealType(dayData.food, 'Lunch').type} • ${getFoodByMealType(dayData.food, 'Lunch').area}`}</span>}
              </div>
              <button className="edit-btn" onClick={() => replaceFood(dayIndex, 'Lunch')}>↻</button>
            </div>
          )}
          
          <div className="time-slot">
            <div className="time-label afternoon">下午 · 悠闲出片 ☀️</div>
            {dayData.afternoon.length === 0 ? (
              <div className="route-item empty-slot">
                <span className="route-name">躺平</span>
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
                        <span 
                          style={{ cursor: 'pointer', color: '#9ca3af', fontSize: '18px' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("🗑️ delete afternoon:", dayIndex, index);
                            removeAttraction(dayIndex, 'afternoon', index);
                          }}
                        >×</span>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            )}
            <button className="add-btn" onClick={() => handleAddClick(dayIndex, 'afternoon')}>+ 加个打卡点</button>
          </div>
          
          {dayData.food && dayData.food.find(f => f.mealType === 'Dinner') && (
            <div className={`route-item food meal-dinner`}>
              <span className="meal-icon">{isDelivery(getFoodByMealType(dayData.food, 'Dinner')) ? '🛵' : '🍽️'}</span>
              <div className="route-food-info">
                <span className="meal-label">晚餐</span>
                <span className="route-name">{getFoodByMealType(dayData.food, 'Dinner')?.name || '晚餐约会呀'}</span>
                {getFoodByMealType(dayData.food, 'Dinner')?.name && <span className="route-food-type">{isDelivery(getFoodByMealType(dayData.food, 'Dinner')) ? '外卖' : `${getFoodByMealType(dayData.food, 'Dinner').type} • ${getFoodByMealType(dayData.food, 'Dinner').area}`}</span>}
              </div>
              <button className="edit-btn" onClick={() => replaceFood(dayIndex, 'Dinner')}>↻</button>
            </div>
          )}

          {dayData.evening && dayData.evening.length > 0 && (
            <div className="time-slot">
              <div className="time-label evening">夜晚 · 城市漫游 🌙</div>
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
                    <span 
                      style={{ cursor: 'pointer', color: '#9ca3af', fontSize: '18px' }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("🗑️ delete evening:", dayIndex, index);
                        removeAttraction(dayIndex, 'evening', index);
                      }}
                    >×</span>
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
        <h2>你的专属路线 ✨</h2>
        <p className="subtitle">{cityMap[city] || city} - {days} 天</p>
        <p className="no-attractions">还没有选景点呢</p>
        <div className="button-row">
          <button className="btn-secondary" onClick={onBack}>返回</button>
          <button className="btn-primary" onClick={onStartOver}>重新开始 🔄</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h2>你的专属路线 ✨</h2>
      <p className="subtitle">{cityMap[city] || city} - {days} 天</p>
      
      <div className="hotel-notice">
        <span className="hotel-icon">🏨</span>
        <span>酒店位置</span>
        <span className="coming-soon">即将上线</span>
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
          <button className="btn-primary" onClick={() => handleAddClick(0, 'morning')}>+ 加个打卡点</button>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(null)}>
          <div className="modal-content add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>添加打卡点 ✨</h3>
            </div>
            <div className="modal-body">
              {unusedAttractions.length === 0 ? (
                <p className="no-attractions">所有景点都安排上啦</p>
              ) : (
                <AddModalList 
                  items={unusedAttractions} 
                  onSelect={(attraction) => addAttraction(showAddModal.dayIndex, showAddModal.slot, attraction)}
                />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddModal(null)}>取消</button>
            </div>
          </div>
        </div>
      )}

      {showFoodModal && (
        <div className="modal-overlay" onClick={() => setShowFoodModal(null)}>
          <div className="modal-content food-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>选一家喜欢的餐厅吧 ✨</h3>
            </div>
            <div className="modal-body">
              {(() => {
                const dayArea = routeByDays[showFoodModal.dayIndex].area
                const allRestaurants = foodData[showFoodModal.mealType] || []
                const sameArea = allRestaurants.filter(r => r.area === dayArea)
                const otherArea = allRestaurants.filter(r => r.area !== dayArea)
                const restaurants = sameArea.length > 0 ? sameArea : otherArea

                if (restaurants.length === 0) {
                  return <p className="no-attractions">暂无餐厅可选</p>
                }

                return (
                  <div className="restaurant-list">
                    {sameArea.length > 0 && (
                      <div className="restaurant-section">
                        <div className="restaurant-section-title">📍 Same area - {dayArea}</div>
                        {sameArea.map(r => (
                          <div key={r.id} className="restaurant-option" onClick={() => selectRestaurant(r)}>
                            <span className="restaurant-name">{r.name}</span>
                            <span className="restaurant-type">{r.type}</span>
                            {r.tags?.map(tag => (
                              <span key={tag} className="restaurant-tag">{tag}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                    {otherArea.length > 0 && (
                      <div className="restaurant-section">
                        <div className="restaurant-section-title">Other areas</div>
                        {otherArea.map(r => (
                          <div key={r.id} className="restaurant-option" onClick={() => selectRestaurant(r)}>
                            <span className="restaurant-name">{r.name}</span>
                            <span className="restaurant-type">{r.type} • {r.area}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
            <div className="modal-footer">
              <button className="btn-delivery" onClick={() => { setSelectedMealType(showFoodModal.mealType); setShowDeliveryModal(true); setShowFoodModal(null); }}>外卖到酒店 🛵</button>
              <button className="btn-secondary" onClick={() => setShowFoodModal(null)}>取消</button>
            </div>
          </div>
        </div>
      )}

      {showRestFoodModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => { setShowRestFoodModal(false); setSelectedCategory(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCategory === 'local' ? '🍜 本地美食' : selectedCategory === 'light' ? '🥗 轻食简餐' : '🧋 奶茶时刻'}</h3>
            </div>
            <div className="modal-body">
              <div className="restaurant-list">
                {(restDayFoodData[selectedCategory] || []).map((item, idx) => (
                  <div key={idx} className="restaurant-option">
                    <span className="restaurant-name">{item}</span>
                    <span className="restaurant-type">Popular</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setShowRestFoodModal(false); setSelectedCategory(null); }}>关闭</button>
            </div>
          </div>
        </div>
      )}

      {showDeliveryModal && (
        <div className="modal-overlay" onClick={() => setShowDeliveryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>点外卖时间 🛵</h3>
            </div>
            <div className="modal-body">
              <div className="delivery-section">
                <div className="delivery-section-title">📍 Same area</div>
                <div className="delivery-grid">
                  <div className="delivery-option" onClick={() => selectDelivery('快餐便当')}>
                    <span className="delivery-name">快餐便当</span>
                    <span className="delivery-type">Quick & Easy</span>
                  </div>
                  <div className="delivery-option" onClick={() => selectDelivery('沙拉轻食')}>
                    <span className="delivery-name">沙拉轻食</span>
                    <span className="delivery-type">Healthy</span>
                  </div>
                  <div className="delivery-option" onClick={() => selectDelivery('奶茶咖啡')}>
                    <span className="delivery-name">奶茶咖啡</span>
                    <span className="delivery-type">Beverages</span>
                  </div>
                </div>
              </div>
              <div className="delivery-section">
                <div className="delivery-section-title">🔥 Popular delivery</div>
                <div className="delivery-grid">
                  <div className="delivery-option" onClick={() => selectDelivery('炸鸡汉堡')}>
                    <span className="delivery-name">炸鸡汉堡</span>
                    <span className="delivery-type">Fast Food</span>
                  </div>
                  <div className="delivery-option" onClick={() => selectDelivery('麻辣烫')}>
                    <span className="delivery-name">麻辣烫</span>
                    <span className="delivery-type">Spicy Hot</span>
                  </div>
                  <div className="delivery-option" onClick={() => selectDelivery('日料便当')}>
                    <span className="delivery-name">日料便当</span>
                    <span className="delivery-type">Japanese</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeliveryModal(false)}>取消</button>
            </div>
          </div>
        </div>
      )}

      <div className="button-row">
        <button className="btn-secondary" onClick={onBack}>返回</button>
        <button className="btn-primary" onClick={onStartOver}>重置全部 🔄</button>
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
  const [userDefinedOrder, setUserDefinedOrder] = useState(false)

  const handleCityNext = (selectedCity, selectedDays) => {
    setCity(selectedCity)
    setDays(selectedDays)
    setSelectedAttractions([])
    setStep(2)
  }

  const handleAttractionNext = (attractions, hasUserOrder = false) => {
    setSelectedAttractions(attractions)
    setUserDefinedOrder(hasUserOrder)
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
            userDefinedOrder={userDefinedOrder}
            onStartOver={handleStartOver}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  )
}

export default App
