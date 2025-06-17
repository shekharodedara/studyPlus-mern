import { useState } from "react"

export default function CategoryModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", description: "" })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (form.name.trim() === "") return
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[90%] max-w-md rounded bg-richblack-800 p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-richblack-5">Add New Category</h2>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm text-richblack-300">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-style"
              placeholder="e.g. Data Science"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-richblack-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-style resize-none"
              rows={3}
              placeholder="Short description about this category"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="rounded bg-richblack-600 px-4 py-2 text-sm font-semibold text-richblack-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
