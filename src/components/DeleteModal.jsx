import React from 'react'

const DeleteModal = ({ state, onCancel, onConfirm }) => {
  if (!state.open) return null
  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-4 w-full max-w-sm">
        <h3 className="font-semibold mb-2 text-gray-800">Delete city</h3>
        <p className="mb-4 text-gray-700">Are you sure you want to delete <strong>{state.name}</strong>?</p>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 rounded border" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-1 !bg-red-600 text-white rounded" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
