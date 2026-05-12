function ProtectionForm({ protection, setProtection }) {
  const update = (field, value) => {
    setProtection((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="form-section">
      <h2 className="section-title">Protection</h2>
      <p className="section-desc">Floor protection and door protection details</p>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="prot-floor">Floor Protection Pad + Plywood on Walking Area</label>
          <input
            id="prot-floor"
            type="text"
            placeholder="e.g. Full coverage on walking areas"
            value={protection.floorProtection}
            onChange={(e) => update('floorProtection', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="prot-plywood">Plywood Details</label>
          <input
            id="prot-plywood"
            type="text"
            placeholder="e.g. 12 sheets plywood on walking area"
            value={protection.plywoodWalking}
            onChange={(e) => update('plywoodWalking', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="prot-pvc">PVC Main Door + Frame</label>
          <input
            id="prot-pvc"
            type="text"
            placeholder="e.g. 2 PVC main door + frame"
            value={protection.pvcMainDoor}
            onChange={(e) => update('pvcMainDoor', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="prot-notes">Notes</label>
          <textarea
            id="prot-notes"
            rows="3"
            placeholder="Additional protection notes..."
            value={protection.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default ProtectionForm
