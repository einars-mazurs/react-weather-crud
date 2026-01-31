import React, { useEffect, useState } from 'react'
import { getCurrentWeather, getCities, addCity, updateCity, deleteCity } from '../api'
import CityCard from './CityCard'
import EditModal from './EditModal'
import DeleteModal from './DeleteModal'

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
        if (!mounted) return
        const normalized = list.map((c, idx) => (typeof c === 'string' ? { id: `s-${idx}`, name: c } : c))
        setCities(normalized)

        const results = await Promise.all(
          normalized.map((c) => getCurrentWeather(c.name).catch(() => null))
        )
        if (!mounted) return
        setCitiesData(results)
      } catch (err) {
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
      const normalized = list.map((c, idx) => (typeof c === 'string' ? { id: `s-${idx}`, name: c } : c))
      setCities(normalized)
      const results = await Promise.all(normalized.map((c) => getCurrentWeather(c.name).catch(() => null)))
      setCitiesData(results)
    } catch (err) {
      alert('Failed to refresh cities')
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
        {cities.map((cityObj, i) => (
          <CityCard
            key={cityObj.id}
            city={cityObj}
            data={citiesData[i]}
            expanded={!!expanded[cityObj.id]}
            onToggleExpand={toggleExpand}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        ))}
      </div>
      <EditModal
        state={editModal}
        onChangeName={(v) => setEditModal((s) => ({ ...s, name: v }))}
        onSave={submitEdit}
        onClose={closeEditModal}
      />
      <DeleteModal state={deleteModal} onCancel={closeDeleteModal} onConfirm={confirmDelete} />
    </div>
  )
}



export default CitiesList


