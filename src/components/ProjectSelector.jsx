import { useState } from 'react';

export default function ProjectSelector({ projects, activeProjectId, onSelect, onCreate, onDelete, loading }) {
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName('');
    setShowNew(false);
  };

  return (
    <div className="project-selector">
      <div className="project-selector-header">
        <h3>My Projects</h3>
        <button className="btn-new-project" onClick={() => setShowNew((v) => !v)}>
          {showNew ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showNew && (
        <div className="new-project-form">
          <input
            type="text"
            placeholder="Project name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <button onClick={handleCreate} disabled={!newName.trim()}>
            Create
          </button>
        </div>
      )}

      {loading ? (
        <p className="project-loading">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="project-empty">No projects yet. Create your first project!</p>
      ) : (
        <ul className="project-list">
          {projects.map((p) => (
            <li
              key={p._id}
              className={`project-item ${p._id === activeProjectId ? 'active' : ''}`}
            >
              <button className="project-item-btn" onClick={() => onSelect(p._id)}>
                <span className="project-item-name">{p.name || 'Untitled Project'}</span>
                <span className="project-item-date">
                  {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </button>
              <button
                className="project-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete "${p.name || 'Untitled'}"?`)) onDelete(p._id);
                }}
                title="Delete project"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
