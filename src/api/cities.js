const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const getCities = async () => {
  const res = await fetch(`${BASE}/api/cities`)
  if (!res.ok) throw new Error('Failed to load cities')
  const json = await res.json()
  return json.cities || []
}

export const addCity = async (name) => {
  const res = await fetch(`${BASE}/api/cities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('Failed to add city')
  return res.json()
}

export const updateCity = async (id, name) => {
  const res = await fetch(`${BASE}/api/cities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error('Failed to update city')
  return res.json()
}

export const deleteCity = async (id) => {
  const res = await fetch(`${BASE}/api/cities/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete city')
  return res.json()
}

export default { getCities, addCity, updateCity, deleteCity }
