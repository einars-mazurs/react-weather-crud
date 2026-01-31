import React from 'react'

const CityCard = ({ city, data, expanded, onToggleExpand, onEdit, onDelete }) => {
  const temp = data?.main?.temp != null ? Math.round(data.main.temp) + '°C' : '--'
  const feels = data?.main?.feels_like != null ? Math.round(data.main.feels_like) + '°C' : '--'
  const humidity = data?.main?.humidity != null ? data.main.humidity + '%' : '--'
  const wind = data?.wind?.speed != null ? data.wind.speed + ' m/s' : '--'
  const desc = data?.weather?.[0]?.description || ''
  const icon = data?.weather?.[0]?.icon
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null

  return (
    <div className="p-3 border border-gray-200 rounded-md bg-white text-center shadow-sm relative">
      <div className="flex items-center justify-center gap-2">
        {iconUrl && <img src={iconUrl} alt={desc || city.name} className="w-12 h-12" />}
        <div className="font-semibold text-lg text-gray-800">{city.name}</div>
      </div>

      <div className="text-sm text-gray-600 mt-1">{desc}</div>

      <div className="text-xl mt-2 font-medium text-gray-800">{temp}</div>

      <div className="mt-2">
        <div className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="text-sm text-gray-700 grid grid-cols-2 gap-2">
            <div>Feels: <span className="font-semibold">{feels}</span></div>
            <div>Humidity: <span className="font-semibold">{humidity}</span></div>
            <div>Wind: <span className="font-semibold">{wind}</span></div>
            <div></div>
          </div>
        </div>
        <div className="mt-2">
          <button className="text-sm text-gray-600" onClick={() => onToggleExpand(city.id)}>
            {expanded ? 'See less ▲' : 'See more ▼'}
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        <button className="text-sm text-blue-600" onClick={() => onEdit(city.id, city.name)}>Edit</button>
        <button className="text-sm text-red-600" onClick={() => onDelete(city.id, city.name)}>Delete</button>
      </div>
    </div>
  )
}

export default CityCard
