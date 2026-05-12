function ScheduleView({ project, protection, workData, materials, roomConfigs }) {
  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const statusLabel = (status) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return 'Pending'
    }
  }

  return (
    <div className="schedule-view">
      <div className="view-actions no-print">
        <button className="btn-print" onClick={handlePrint}>
          Print Schedule
        </button>
      </div>

      <div className="print-sheet">
        <div className="print-header">
          <h2>Renovation Daily Work Schedule</h2>
          <div className="print-meta">
            <div className="meta-row">
              <strong>ID:</strong> <span>{project.id || '-'}</span>
            </div>
            <div className="meta-row">
              <strong>Company:</strong> <span>{project.company || '-'}</span>
            </div>
            <div className="meta-row">
              <strong>Address:</strong> <span>{project.address || '-'}</span>
            </div>
            <div className="meta-row">
              <strong>Lock:</strong> <span>{project.lockCode || '-'}</span>
            </div>
            <div className="meta-row">
              <strong>Date:</strong> <span>{formatDate(project.date)}</span>
            </div>
            <div className="meta-row">
              <strong>Type:</strong> <span>{project.projectType || '-'}</span>
            </div>
          </div>
        </div>

        <div className="print-section">
          <h3>Protection</h3>
          <ul className="detail-list">
            {protection.floorProtection && (
              <li>Floor Protection: {protection.floorProtection}</li>
            )}
            {protection.plywoodWalking && (
              <li>Plywood: {protection.plywoodWalking}</li>
            )}
            {protection.pvcMainDoor && (
              <li>PVC Main Door + Frame: {protection.pvcMainDoor}</li>
            )}
            {protection.notes && <li>Notes: {protection.notes}</li>}
            {!protection.floorProtection &&
              !protection.plywoodWalking &&
              !protection.pvcMainDoor &&
              !protection.notes && <li className="empty">No protection data entered</li>}
          </ul>
        </div>

        {roomConfigs.map((room) => {
          const data = workData[room.key]
          const hasData = room.fields.some((f) => data[f.name]?.trim())
          return (
            <div key={room.key} className="print-section">
              <h3>
                {room.title}
                <span className={`print-status ${data.status}`}>
                  {statusLabel(data.status)}
                </span>
              </h3>
              {data.assignedDate && (
                <p className="print-date">Date: {formatDate(data.assignedDate)}</p>
              )}
              {data.worker && <p className="print-worker">Worker: {data.worker}</p>}
              {hasData ? (
                <ul className="detail-list">
                  {room.fields.map(
                    (f) =>
                      data[f.name]?.trim() && (
                        <li key={f.name}>
                          <strong>{f.label}:</strong> {data[f.name]}
                        </li>
                      )
                  )}
                </ul>
              ) : (
                <p className="empty">No data entered</p>
              )}
            </div>
          )
        })}

        <div className="print-section">
          <h3>Materials</h3>
          {materials.length > 0 ? (
            <table className="materials-table print-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Material</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity || '-'}</td>
                    <td>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty">No materials listed</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScheduleView
