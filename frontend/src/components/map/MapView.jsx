import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const SEVERITY_COLORS = { low: '#eab308', medium: '#f97316', high: '#ef4444', critical: '#a855f7' }

const DOT = (color, size = 14) =>
  `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`

const LEGEND_ITEMS = [
  { label: 'Animal Reports', color: '#3b82f6' },
  { label: 'Doctors', color: '#34d399' },
  { label: 'Cruelty (low)', color: '#eab308' },
  { label: 'Cruelty (medium)', color: '#f97316' },
  { label: 'Cruelty (high)', color: '#ef4444' },
  { label: 'Cruelty (critical)', color: '#a855f7' },
]

export default function MapView({ doctors = [], cruelty = [], animalReports = [], center = { lat: 31.5497, lng: 74.3436 }, zoom = 7 }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const legendRef = useRef(null)

  useEffect(() => {
    if (mapInstanceRef.current) return
    const map = L.map(mapRef.current, { zoomControl: true }).setView([center.lat, center.lng], zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map)

    const legend = L.control({ position: 'bottomright' })
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', '')
      div.style.background = 'rgba(24,24,27,.85)'
      div.style.backdropFilter = 'blur(8px)'
      div.style.borderRadius = '10px'
      div.style.padding = '10px 14px'
      div.style.fontSize = '12px'
      div.style.lineHeight = '1.8'
      div.style.border = '1px solid rgba(63,63,70,.6)'
      div.style.color = '#e4e4e7'
      div.innerHTML = LEGEND_ITEMS.map(item =>
        `<div style="display:flex;align-items:center;gap:8px"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${item.color}"></span>${item.label}</div>`
      ).join('')
      legendRef.current = div
      return div
    }
    legend.addTo(map)

    mapInstanceRef.current = map
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []

    animalReports.forEach(item => {
      if (!item.lat || !item.lng) return
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({ className: '', html: DOT('#3b82f6', 16), iconSize: [16, 16], iconAnchor: [8, 8] })
      })
        .addTo(map)
        .bindPopup(`<b>Animal Report</b><br/>Type: ${item.animal_type}<br/>${item.location}<br/>Status: ${item.status}`)
      markersRef.current.push(marker)
    })

    doctors.forEach(doc => {
      if (!doc.lat || !doc.lng) return
      const marker = L.marker([doc.lat, doc.lng], {
        icon: L.divIcon({ className: '', html: DOT('#34d399', 16), iconSize: [16, 16], iconAnchor: [8, 8] })
      })
        .addTo(map)
        .bindPopup(`<b>${doc.name}</b><br/>${doc.clinic_name}<br/>${doc.city}`)
      markersRef.current.push(marker)
    })

    cruelty.forEach(item => {
      if (!item.lat || !item.lng) return
      const color = SEVERITY_COLORS[item.severity] || '#ef4444'
      const marker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({ className: '', html: DOT(color, 16), iconSize: [16, 16], iconAnchor: [8, 8] })
      })
        .addTo(map)
        .bindPopup(`<b>Cruelty Report</b><br/>Severity: ${item.severity}<br/>${item.location}`)
      markersRef.current.push(marker)
    })
  }, [doctors, cruelty, animalReports])

  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px' }} className="overflow-hidden rounded-xl ring-1 ring-zinc-800" />
  )
}
