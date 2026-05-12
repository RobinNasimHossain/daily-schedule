import { useState } from 'react'

function ScheduleList({ schedules, loading, onSelect, onDelete, onDuplicate, onCreate }) {
  const [search, setSearch] = useState('')

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getWorkStats = (schedule) => {
    const workData = schedule.workData || {}
    let pending = 0
    let inProgress = 0
    let completed = 0

    const entries = workData instanceof Map ? [...workData.values()] : Object.values(workData)
    entries.forEach((room) => {
      if (room.status === 'completed') completed++
      else if (room.status === 'in-progress') inProgress++
      else pending++
    })

    return { pending, inProgress, completed, total: entries.length }
  }

  const filtered = schedules.filter((s) => {
    if (!search) return true
    const term = search.toLowerCase()
    return (
      (s.project?.id || '').toLowerCase().includes(term) ||
      (s.project?.company || '').toLowerCase().includes(term) ||
      (s.project?.address || '').toLowerCase().includes(term)
    )
  })

  return (
    <div className="form-section">
      <div className="schedule-list-header">
        <div>
          <h2 className="section-title">Saved Schedules</h2>
          <p className="section-desc">
            {schedules.length} schedule{schedules.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <button className="btn-add" onClick={onCreate}>
          + New Schedule
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, company, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Loading schedules...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          {search ? 'No schedules match your search' : 'No schedules yet. Create your first one!'}
        </div>
      ) : (
        <div className="schedule-cards">
          {filtered.map((schedule) => {
            const stats = getWorkStats(schedule)
            return (
              <div key={schedule._id} className="schedule-card">
                <div className="schedule-card-body" onClick={() => onSelect(schedule)}>
                  <div className="schedule-card-top">
                    <h3>{schedule.project?.id || 'Untitled'}</h3>
                    <span className="schedule-date">{formatDate(schedule.project?.date)}</span>
                  </div>
                  <p className="schedule-company">{schedule.project?.company || '-'}</p>
                  <p className="schedule-address">{schedule.project?.address || '-'}</p>
                  <div className="schedule-stats-row">
                    <span className="mini-stat pending">{stats.pending} Pending</span>
                    <span className="mini-stat progress">{stats.inProgress} In Progress</span>
                    <span className="mini-stat done">{stats.completed} Done</span>
                  </div>
                </div>
                <div className="schedule-card-actions">
                  <button
                    className="btn-action btn-dup"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDuplicate(schedule._id)
                    }}
                    title="Duplicate"
                  >
                    Copy
                  </button>
                  <button
                    className="btn-action btn-del"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm('Delete this schedule?')) {
                        onDelete(schedule._id)
                      }
                    }}
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ScheduleList
