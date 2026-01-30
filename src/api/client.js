import axios from 'axios'

const API_KEY = '0919656187a59428e29ffc000903da72'

const url = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: API_KEY ? { appid: API_KEY } : undefined,
})

export const get = async (path, params = {}, config = {}) => {
  const response = await url.get(path, { params, ...config })
  return response.data
}

export default { url, get }
