import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const SEVERITY_COLORS = { low: '#eab308', medium: '#f97316', high: '#ef4444', critical: '#a855f7' }

export default function MapView({ doctors = [], cruelty = [], center = { lat: 31.5497, lng: 74.3436 }, zoom = 7 }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (mapInstanceRef.current) return
    mapInstanceRef.current = L.map(mapRef.current, { zoomControl: true }).setView([center.lat, center.lng], zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(mapInstanceRef.current)
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []

    doctors.forEach(doc => {
      if (!doc.lat || !doc.lng) return
      const icon = L.divIcon({
        className: '',
        html: '<div style="background:#10b981;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      })
      const marker = L.marker([doc.lat, doc.lng], { icon })
        .addTo(map)
        .bindPopup(`<b>${doc.name}</b><br/>${doc.clinic_name}<br/>${doc.city}`)
      markersRef.current.push(marker)
    })

    cruelty.forEach(item => {
      if (!item.lat || !item.lng) return
      const color = SEVERITY_COLORS[item.severity] || '#ef4444'
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      })
      const marker = L.marker([item.lat, item.lng], { icon })
        .addTo(map)
        .bindPopup(`<b>Cruelty Report</b><br/>Severity: ${item.severity}<br/>${item.location}`)
      markersRef.current.push(marker)
    })
  }, [doctors, cruelty])

  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px' }} className="overflow-hidden rounded-xl ring-1 ring-zinc-800" />
  )
}
