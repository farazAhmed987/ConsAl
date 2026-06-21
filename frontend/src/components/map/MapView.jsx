import { useEffect, useRef } from 'react'

export default function MapView({ doctors = [], cruelty = [], center = { lat: 31.5497, lng: 74.3436 }, zoom = 7 }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!window.google || !mapRef.current) return
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]
    })
  }, [])

  useEffect(() => {
    if (!window.google || !mapInstanceRef.current) return
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    doctors.forEach(doc => {
      if (!doc.lat || !doc.lng) return
      const marker = new window.google.maps.Marker({
        position: { lat: doc.lat, lng: doc.lng },
        map: mapInstanceRef.current,
        title: doc.name,
        icon: { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }
      })
      const info = new window.google.maps.InfoWindow({
        content: `<b>${doc.name}</b><br/>${doc.clinic_name}<br/>${doc.city}`
      })
      marker.addListener('click', () => info.open(mapInstanceRef.current, marker))
      markersRef.current.push(marker)
    })

    cruelty.forEach(item => {
      if (!item.lat || !item.lng) return
      const colors = { low: 'yellow', medium: 'orange', high: 'red', critical: 'purple' }
      const marker = new window.google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map: mapInstanceRef.current,
        title: item.severity,
        icon: { url: `http://maps.google.com/mapfiles/ms/icons/${colors[item.severity] || 'red'}-dot.png` }
      })
      const info = new window.google.maps.InfoWindow({
        content: `<b>Cruelty Report</b><br/>Severity: ${item.severity}<br/>${item.location}`
      })
      marker.addListener('click', () => info.open(mapInstanceRef.current, marker))
      markersRef.current.push(marker)
    })
  }, [doctors, cruelty])

  return (
    <div ref={mapRef} style={{ width: '100%', height: '400px' }} className="overflow-hidden rounded-xl ring-1 ring-zinc-800">
      {!window.google && (
        <div className="flex h-full items-center justify-center rounded-xl bg-zinc-900 px-6 text-center text-sm text-zinc-500">
          Google Maps API key not configured. Add your key in MapPage.jsx
        </div>
      )}
    </div>
  )
}
