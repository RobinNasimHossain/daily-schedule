import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#f59e0b' },
  { value: 'in-progress', label: 'In Progress', color: '#3b82f6' },
  { value: 'completed', label: 'Completed', color: '#10b981' },
]

function WorkSection({ config, data, onChange }) {
  const [expanded, setExpanded] = useState(false)

  const statusInfo = STATUS_OPTIONS.find((s) => s.value === data.status) || STATUS_OPTIONS[0]
  const filledCount = config.fields.filter((f) => data[f.name]?.trim()).length
  const totalFields = config.fields.length

  return (
    <div className={`work-card ${data.status}`}>
      <div className="work-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="work-card-title">
          <span className={`expand-icon ${expanded ? 'open' : ''}`}>&#9654;</span>
          <h3>{config.title}</h3>
          <span className="field-count">
            {filledCount}/{totalFields} fields
          </span>
        </div>
        <div className="work-card-meta">
          <span className="status-badge" style={{ background: statusInfo.color }}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="work-card-body">
          <div className="work-meta-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={data.status}
                onChange={(e) => onChange('status', e.target.value)}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Date</label>
              <input
                type="date"
                value={data.assignedDate || ''}
                onChange={(e) => onChange('assignedDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Worker / Team</label>
              <input
                type="text"
                placeholder="Assigned worker"
                value={data.worker || ''}
                onChange={(e) => onChange('worker', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid">
            {config.fields.map((field) => (
              <div
                key={field.name}
                className={`form-group ${field.type === 'textarea' ? 'full-width' : ''}`}
              >
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows="2"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={data[field.name] || ''}
                    onChange={(e) => onChange(field.name, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={data[field.name] || ''}
                    onChange={(e) => onChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkSection
