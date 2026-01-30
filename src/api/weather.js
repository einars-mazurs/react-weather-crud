import { get } from './client'

export const getCurrentWeather = async (city) => {
  if (!city) throw new Error('city is required')
  return get('/weather', { q: city, units: 'metric' })
}
