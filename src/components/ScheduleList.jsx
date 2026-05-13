function ScheduleList({ schedules, loading, onSelect, onDelete, onCreate }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusCounts = (schedule) => {
    const workData = schedule.workData || {}
    const entries = workData instanceof Map
      ? Array.from(workData.values())
      : Object.values(workData)
    const total = entries.length
    const completed = entries.filter((w) => w.status === 'completed').length
    const inProgress = entries.filter((w) => w.status === 'in-progress').length
    return { total, completed, inProgress, pending: total - completed - inProgress }
  }

  return (
    <div className="schedule-list">
      <div className="list-header">
        <h2 className="section-title">All Projects</h2>
        <button className="btn-add" onClick={onCreate}>
          + New Project
        </button>
      </div>

      {loading && <p className="loading-text">Loading projects...</p>}

      {!loading && schedules.length === 0 && (
        <div className="empty-state">
          <p>No projects yet. Create your first renovation project!</p>
          <button className="btn-add" onClick={onCreate}>
            + New Project
          </button>
        </div>
      )}

      <div className="project-cards">
        {schedules.map((schedule) => {
          const counts = getStatusCounts(schedule)
          return (
            <div key={schedule._id} className="project-card" onClick={() => onSelect(schedule._id)}>
              <div className="project-card-header">
                <h3>{schedule.project?.id || 'Untitled Project'}</h3>
                <button
                  className="btn-remove"
                  title="Delete project"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Delete this project? This cannot be undone.')) {
                      onDelete(schedule._id)
                    }
                  }}
                >
                  &times;
                </button>
              </div>
              <p className="project-card-company">{schedule.project?.company || '-'}</p>
              <p className="project-card-address">{schedule.project?.address || '-'}</p>
              <div className="project-card-meta">
                <span className="project-card-date">{formatDate(schedule.project?.date || schedule.createdAt)}</span>
                <span className="project-card-type">{schedule.project?.projectType || '-'}</span>
              </div>
              <div className="project-card-stats">
                <span className="mini-stat pending">{counts.pending} Pending</span>
                <span className="mini-stat progress">{counts.inProgress} Active</span>
                <span className="mini-stat done">{counts.completed} Done</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ScheduleList
