import React, { useEffect, useState } from 'react'
import { getCurrentWeather, getCities, addCity, updateCity, deleteCity } from '../api'

const CitiesList = () => {
  const [cities, setCities] = useState([])
  const [citiesData, setCitiesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCity, setNewCity] = useState('')

  useEffect(() => {
    let mounted = true
    const fetchCities = async () => {
      try {
        const list = await getCities()
        console.log('fetched cities:', list)
        if (!mounted) return
        const normalized = list.map((c, idx) => (typeof c === 'string' ? { id: `s-${idx}`, name: c } : c))
        setCities(normalized)

        const results = await Promise.all(
          normalized.map((c) => getCurrentWeather(c.name).catch(() => null))
        )
        if (!mounted) return
        setCitiesData(results)
      } catch (err) {
        console.error('Failed to load cities', err)
        if (mounted) setCities([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchCities()
    return () => (mounted = false)
  }, [])

  const refresh = async () => {
    setLoading(true)
    try {
      const list = await getCities()
      console.log('refresh cities:', list)
      const normalized = list.map((c, idx) => (typeof c === 'string' ? { id: `s-${idx}`, name: c } : c))
      setCities(normalized)
      const results = await Promise.all(normalized.map((c) => getCurrentWeather(c.name).catch(() => null)))
      setCitiesData(results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    const name = newCity.trim()
    if (!name) return
    try {
      await addCity(name)
      setNewCity('')
      await refresh()
    } catch (err) {
      console.error('Add failed', err)
      alert('Failed to add city')
    }
  }

  const [editModal, setEditModal] = useState({ open: false, id: null, name: '' })
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' })
  const [expanded, setExpanded] = useState({})

  const toggleExpand = (id) => setExpanded((s) => ({ ...s, [id]: !s[id] }))

  const openEditModal = (id, currentName) => setEditModal({ open: true, id, name: currentName })
  const closeEditModal = () => setEditModal({ open: false, id: null, name: '' })
  const submitEdit = async () => {
    const name = (editModal.name || '').trim()
    if (!name) return
    try {
      await updateCity(editModal.id, name)
      closeEditModal()
      await refresh()
    } catch (err) {
      console.error('Update failed', err)
      alert('Failed to update city')
    }
  }

  const openDeleteModal = (id, name) => setDeleteModal({ open: true, id, name })
  const closeDeleteModal = () => setDeleteModal({ open: false, id: null, name: '' })
  const confirmDelete = async () => {
    try {
      await deleteCity(deleteModal.id)
      closeDeleteModal()
      await refresh()
    } catch (err) {
      console.error('Delete failed', err)
      alert('Failed to delete city')
    }
  }

  if (loading) return <div className="text-center p-4">Loading cities...</div>

  return (
    <div className="p-4">
      <div className="flex justify-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Add city"
          className="text-gray-600 placeholder:text-gray-400 p-2 rounded-md border border-gray-300 focus:outline-none"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
        />
        <button className="px-3 py-2 !bg-blue-500 text-white rounded-md" onClick={handleAdd}>Add</button>
      </div>

      <div className="cities-grid grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {cities.map((cityObj, i) => {
          const data = citiesData[i]
          const temp = data?.main?.temp != null ? Math.round(data.main.temp) + '°C' : '--'
          const feels = data?.main?.feels_like != null ? Math.round(data.main.feels_like) + '°C' : '--'
          const humidity = data?.main?.humidity != null ? data.main.humidity + '%' : '--'
          const wind = data?.wind?.speed != null ? data.wind.speed + ' m/s' : '--'
          const desc = data?.weather?.[0]?.description || ''
          const icon = data?.weather?.[0]?.icon
          const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null
          return (
            <div key={cityObj.id} className="p-3 border border-gray-200 rounded-md bg-white text-center shadow-sm relative">
              <div className="flex items-center justify-center gap-2">
                {iconUrl && <img src={iconUrl} alt={desc || cityObj.name} className="w-12 h-12" />}
                <div className="font-semibold text-lg">{cityObj.name}</div>
              </div>

              <div className="text-sm text-gray-600 mt-1">{desc}</div>

              <div className="text-xl mt-2 font-medium">{temp}</div>

              <div className="mt-2">
                <div className={`overflow-hidden transition-all duration-200 ${expanded[cityObj.id] ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="text-sm text-gray-700 grid grid-cols-2 gap-2">
                    <div>Feels: <span className="font-semibold">{feels}</span></div>
                    <div>Humidity: <span className="font-semibold">{humidity}</span></div>
                    <div>Wind: <span className="font-semibold">{wind}</span></div>
                    <div></div>
                  </div>
                </div>
                <div className="mt-2">
                  <button className="text-sm text-gray-600" onClick={() => toggleExpand(cityObj.id)}>
                    {expanded[cityObj.id] ? 'See less ▲' : 'See more ▼'}
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-3">
                <button className="text-sm text-blue-600" onClick={() => openEditModal(cityObj.id, cityObj.name)}>Edit</button>
                <button className="text-sm text-red-600" onClick={() => openDeleteModal(cityObj.id, cityObj.name)}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
      <ModalEdit
        state={editModal}
        setState={setEditModal}
        onChangeName={(v) => setEditModal((s) => ({ ...s, name: v }))}
        onSave={submitEdit}
        onClose={closeEditModal}
      />
      <ModalDelete state={deleteModal} onCancel={closeDeleteModal} onConfirm={confirmDelete} />
    </div>
  )
}

// Edit Modal
function ModalEdit({ state, setState, onChangeName, onSave, onClose }) {
  if (!state.open) return null
  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-4 w-full max-w-md">
        <h3 className="font-semibold mb-2">Edit city</h3>
        <input
          className="w-full p-2 border rounded mb-3"
          value={state.name}
          onChange={(e) => onChangeName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 !bg-blue-600 text-white rounded" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  )
}

// Delete Modal
function ModalDelete({ state, onCancel, onConfirm }) {
  if (!state.open) return null
  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-4 w-full max-w-sm">
        <h3 className="font-semibold mb-2">Delete city</h3>
        <p className="mb-4">Are you sure you want to delete <strong>{state.name}</strong>?</p>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-1 !bg-red-600 text-white rounded" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default CitiesList


