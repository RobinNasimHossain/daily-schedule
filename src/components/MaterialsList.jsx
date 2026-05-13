import { useState } from 'react'

function MaterialsList({ materials, setMaterials }) {
  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: 'pcs' })

  const updateMaterial = (id, field, value) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const addMaterial = () => {
    if (!newItem.name.trim()) return
    const nextId = materials.length > 0 ? Math.max(...materials.map((m) => m.id)) + 1 : 1
    setMaterials((prev) => [...prev, { ...newItem, id: nextId }])
    setNewItem({ name: '', quantity: '', unit: 'pcs' })
  }

  const removeMaterial = (id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addMaterial()
  }

  return (
    <div className="form-section">
      <h2 className="section-title">Materials List</h2>
      <p className="section-desc">Track materials needed for the project</p>

      <div className="materials-table-wrap">
        <table className="materials-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Material</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((item, idx) => (
              <tr key={item.id}>
                <td className="row-num">{idx + 1}</td>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateMaterial(item.id, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => updateMaterial(item.id, 'quantity', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={item.unit}
                    onChange={(e) => updateMaterial(item.id, 'unit', e.target.value)}
                  >
                    <option value="pcs">pcs</option>
                    <option value="rolls">rolls</option>
                    <option value="sheets">sheets</option>
                    <option value="bags">bags</option>
                    <option value="boxes">boxes</option>
                    <option value="sets">sets</option>
                    <option value="sqft">sqft</option>
                    <option value="meters">meters</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn-remove"
                    onClick={() => removeMaterial(item.id)}
                    title="Remove"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="add-material-row">
        <input
          type="text"
          placeholder="Material name"
          value={newItem.name}
          onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          placeholder="Qty"
          value={newItem.quantity}
          onChange={(e) => setNewItem((p) => ({ ...p, quantity: e.target.value }))}
          onKeyDown={handleKeyDown}
        />
        <select
          value={newItem.unit}
          onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))}
        >
          <option value="pcs">pcs</option>
          <option value="rolls">rolls</option>
          <option value="sheets">sheets</option>
          <option value="bags">bags</option>
          <option value="boxes">boxes</option>
          <option value="sets">sets</option>
          <option value="sqft">sqft</option>
          <option value="meters">meters</option>
        </select>
        <button className="btn-add" onClick={addMaterial}>
          + Add
        </button>
      </div>
    </div>
  )
}

export default MaterialsList
