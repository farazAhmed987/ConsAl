import { useState, useEffect } from 'react'
import api from '../api/client'
import PageLayout from '../components/layout/PageLayout'
import MapView from '../components/map/MapView'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function MapPage() {
  const [mapData, setMapData] = useState({ doctors: [], cruelty: [], animalReports: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/map-data').then(res => setMapData(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const totalItems = mapData.doctors.length + mapData.cruelty.length + mapData.animalReports.length

  return (
    <PageLayout title="Shelters & Doctors Map" subtitle="Find veterinarians and view cruelty report locations across Punjab."
      maxWidth="md:w-11/12 lg:w-4/5">
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 backdrop-blur">
            <MapView doctors={mapData.doctors} cruelty={mapData.cruelty} animalReports={mapData.animalReports} />
          </div>
          <div className="mt-4 flex flex-wrap gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm backdrop-blur">
            <span className="font-semibold text-zinc-300">Legend:</span>
            <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-blue-500"></span> Animal Reports</div>
            <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-emerald-400"></span> Approved Doctors</div>
            <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-yellow-500"></span> Cruelty (low)</div>
            <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-orange-500"></span> Cruelty (medium)</div>
            <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-red-500"></span> Cruelty (high)</div>
            <div className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-purple-500"></span> Cruelty (critical)</div>
          </div>
          {totalItems === 0 && (
            <div className="py-8 text-center text-zinc-500">
              <p className="text-lg">📍 No location data available yet</p>
              <p className="mt-1 text-sm">Data will appear once doctors are approved and reports are submitted.</p>
            </div>
          )}
        </>
      )}
    </PageLayout>
  )
}
