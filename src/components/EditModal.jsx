import React from 'react'

const EditModal = ({ state, onChangeName, onSave, onClose }) => {
  if (!state.open) return null
  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-4 w-full max-w-md">
        <h3 className="font-semibold mb-2 text-gray-800">Edit city</h3>
        <input
          className="w-full p-2 border rounded mb-3 text-gray-700"
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

export default EditModal
