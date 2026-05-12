function ProjectInfo({ project, setProject }) {
  const update = (field, value) => {
    setProject((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="form-section">
      <h2 className="section-title">Project Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="proj-id">ID / Name</label>
          <input
            id="proj-id"
            type="text"
            placeholder="e.g. Ming Gang"
            value={project.id}
            onChange={(e) => update('id', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="proj-company">Company</label>
          <input
            id="proj-company"
            type="text"
            placeholder="e.g. FAN CHEN STUDIOS PTE LTD"
            value={project.company}
            onChange={(e) => update('company', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="proj-address">Address</label>
          <input
            id="proj-address"
            type="text"
            placeholder="e.g. 586 YIO CHU KANG ROAD 06-04"
            value={project.address}
            onChange={(e) => update('address', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="proj-lock">Lock Code</label>
          <input
            id="proj-lock"
            type="text"
            placeholder="e.g. 7288"
            value={project.lockCode}
            onChange={(e) => update('lockCode', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="proj-date">Date</label>
          <input
            id="proj-date"
            type="date"
            value={project.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label htmlFor="proj-type">Project Type</label>
          <input
            id="proj-type"
            type="text"
            placeholder="e.g. Protection 3BR Condo"
            value={project.projectType}
            onChange={(e) => update('projectType', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default ProjectInfo
