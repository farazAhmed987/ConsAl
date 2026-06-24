import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapPicker({ lat, lng, onChange, onAddressChange, height = '250px', center = { lat: 31.5497, lng: 74.3436 }, zoom = 6 }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (mapInstanceRef.current) return
    const map = L.map(mapRef.current, { zoomControl: true }).setView([center.lat, center.lng], zoom)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map)

    map.on('click', (e) => {
      placeMarker(e.latlng.lat, e.latlng.lng)
      onChange?.(e.latlng.lat, e.latlng.lng)
      reverseGeocode(e.latlng.lat, e.latlng.lng)
    })

    mapInstanceRef.current = map
  }, [])

  useEffect(() => {
    if (lat != null && lng != null && mapInstanceRef.current) {
      placeMarker(lat, lng)
      mapInstanceRef.current.setView([lat, lng], Math.max(mapInstanceRef.current.getZoom(), 12))
      reverseGeocode(lat, lng)
    }
  }, [lat, lng])

  function reverseGeocode(lat, lng) {
    if (!onAddressChange) return
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`)
      .then(r => r.json())
      .then(data => {
        const addr = data.display_name || ''
        onAddressChange(addr)
      })
      .catch(() => {})
  }

  function placeMarker(lat, lng) {
    const map = mapInstanceRef.current
    if (!map) return
    if (markerRef.current) map.removeLayer(markerRef.current)
    const icon = L.divIcon({
      className: '',
      html: '<div style="background:#34d399;width:18px;height:18px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    })
    markerRef.current = L.marker([lat, lng], { icon, draggable: true })
      .addTo(map)
      .on('dragend', () => {
        const pos = markerRef.current.getLatLng()
        onChange?.(pos.lat, pos.lng)
        reverseGeocode(pos.lat, pos.lng)
      })
  }

  return (
    <div ref={mapRef} style={{ width: '100%', height }} className="overflow-hidden rounded-xl ring-1 ring-zinc-700" />
  )
}
