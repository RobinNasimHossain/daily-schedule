import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import AuthPage from './components/auth/AuthPage'
import ProjectSelector from './components/ProjectSelector'
import ProjectInfo from './components/ProjectInfo'
import ProtectionForm from './components/ProtectionForm'
import WorkSection from './components/WorkSection'
import MaterialsList from './components/MaterialsList'
import ScheduleView from './components/ScheduleView'
import api from './services/api'
import './App.css'

const ROOM_CONFIGS = [
  {
    key: 'hackingRemoval',
    title: 'Hacking / Removal',
    fields: [
      { name: 'kitchenCabinet', label: 'Kitchen Cabinet', type: 'text' },
      { name: 'toiletWallFloor', label: 'Toilet Wall & Floor', type: 'text' },
      { name: 'falseCeiling', label: 'False Ceiling', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    key: 'living',
    title: 'Living Room',
    fields: [
      { name: 'tallCabinet', label: 'Tall Cabinet (ft)', type: 'text' },
      { name: 'tvConsole', label: 'TV Console (ft)', type: 'text' },
      { name: 'tvFeature', label: 'TV Feature Wall (ft)', type: 'text' },
      { name: 'blinds', label: 'Blinds', type: 'text' },
      { name: 'lbox', label: 'L-Box', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    key: 'kitchen',
    title: 'Kitchen',
    fields: [
      { name: 'glassDoor', label: 'Glass Door', type: 'text' },
      { name: 'cabinet', label: 'Cabinet', type: 'text' },
      { name: 'backsplash', label: 'Backsplash', type: 'text' },
      { name: 'countertop', label: 'Countertop', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    key: 'maidRoom',
    title: 'Maid Room / Balcony',
    fields: [
      { name: 'halfHeight', label: 'Half Height Wall (ft)', type: 'text' },
      { name: 'shelving', label: 'Shelving', type: 'text' },
      { name: 'balconyTiles', label: 'Balcony Tiles (ft)', type: 'text' },
      { name: 'balconyHalfWall', label: 'Balcony Half Height Wall (ft)', type: 'text' },
      { name: 'window', label: 'Window', type: 'text' },
      { name: 'windowGrill', label: 'Window Grill', type: 'text' },
      { name: 'hangerThrow', label: 'Hanger Throw', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    key: 'walkway',
    title: 'Walkway',
    fields: [
      { name: 'fullHeightCabinet', label: 'Full Height Cabinet (ft)', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    key: 'room1',
    title: 'Room 1',
    fields: [
      { name: 'windowFrame', label: 'Window & Frame (ft)', type: 'text' },
      { name: 'wallHangCabinet', label: 'Wall Hang Cabinet (ft)', type: 'text' },
      { name: 'wardrobe', label: 'Wardrobe (ft)', type: 'text' },
      { name: 'blinds', label: 'Blinds', type: 'text' },
      { name: 'partition', label: 'Partition (ft)', type: 'text' },
      { name: 'glass', label: 'Glass (ft)', type: 'text' },
      { name: 'lbox', label: 'L-Box', type: 'text' },
      { name: 'doorFrame', label: 'Door & Frame', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    key: 'room2',
    title: 'Room 2',
    fields: [
      { name: 'lbox', label: 'L-Box', type: 'text' },
      { name: 'vanity', label: 'Vanity (ft)', type: 'text' },
      { name: 'wardrobe', label: 'Wardrobe (ft)', type: 'text' },
      { name: 'doorFrame', label: 'Door & Frame', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    key: 'masterBedroom',
    title: 'Master Bedroom',
    fields: [
      { name: 'doorFrame', label: 'Door & Frame', type: 'text' },
      { name: 'lbox', label: 'L-Box', type: 'text' },
      { name: 'wardrobe', label: 'Wardrobe (ft)', type: 'text' },
      { name: 'balconyDecking', label: 'Balcony Decking (ft)', type: 'text' },
      { name: 'toiletGlassDoor', label: 'Toilet Glass Door', type: 'text' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  {
    key: 'misc',
    title: 'Misc',
    fields: [
      { name: 'toiletDoorFrame', label: 'Toilet Door & Frame', type: 'text' },
      { name: 'other', label: 'Other Work', type: 'textarea' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
]

const TABS = [
  { key: 'projects', label: 'Projects' },
  { key: 'info', label: 'Project Info' },
  { key: 'protection', label: 'Protection' },
  { key: 'work', label: 'Work Schedule' },
  { key: 'materials', label: 'Materials' },
  { key: 'view', label: 'View Schedule' },
]

function getInitialWorkData() {
  const data = {}
  ROOM_CONFIGS.forEach((room) => {
    data[room.key] = {}
    room.fields.forEach((field) => {
      data[room.key][field.name] = ''
    })
    data[room.key].status = 'pending'
    data[room.key].assignedDate = ''
    data[room.key].worker = ''
  })
  return data
}

const INITIAL_PROJECT = {
  id: '',
  company: '',
  address: '',
  lockCode: '',
  date: '',
  projectType: '',
}

const INITIAL_PROTECTION = {
  floorProtection: '',
  plywoodWalking: '',
  pvcMainDoor: '',
  notes: '',
}

const INITIAL_MATERIALS = [
  { name: 'Protection Pad', quantity: '', unit: 'pcs' },
  { name: 'Painter Tape', quantity: '', unit: 'rolls' },
  { name: 'Plywood', quantity: '', unit: 'sheets' },
  { name: 'PVC', quantity: '', unit: 'pcs' },
]

function App() {
  const { user, loading: authLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [projectsLoading, setProjectsLoading] = useState(false)

  const [project, setProject] = useState(INITIAL_PROJECT)
  const [protection, setProtection] = useState(INITIAL_PROTECTION)
  const [workData, setWorkData] = useState(getInitialWorkData())
  const [materials, setMaterials] = useState(INITIAL_MATERIALS)
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef(null)

  // Load projects list
  const loadProjects = useCallback(async () => {
    setProjectsLoading(true)
    try {
      const data = await api.getProjects()
      setProjects(data)
    } catch {
      // silent
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    api.getProjects().then((data) => {
      if (!cancelled) {
        setProjects(data)
        setProjectsLoading(false)
      }
    }).catch(() => {
      if (!cancelled) setProjectsLoading(false)
    })
    return () => { cancelled = true }
  }, [user])

  // Load active project data
  const loadProject = useCallback(async (id) => {
    try {
      const p = await api.getProject(id)
      setProject({
        id: p.name || '',
        company: p.company || '',
        address: p.address || '',
        lockCode: p.lockCode || '',
        date: p.projectDate || '',
        projectType: p.projectType || '',
      })
      setProtection(p.protection || INITIAL_PROTECTION)
      setWorkData(Object.keys(p.workData || {}).length ? p.workData : getInitialWorkData())
      setMaterials(p.materials?.length ? p.materials : INITIAL_MATERIALS)
      setActiveProjectId(id)
      setActiveTab('info')
    } catch {
      // silent
    }
  }, [])

  // Auto-save with debounce
  const saveProject = useCallback(async () => {
    if (!activeProjectId) return
    setSaving(true)
    try {
      await api.updateProject(activeProjectId, {
        name: project.id,
        company: project.company,
        address: project.address,
        lockCode: project.lockCode,
        projectDate: project.date,
        projectType: project.projectType,
        protection,
        workData,
        materials,
      })
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }, [activeProjectId, project, protection, workData, materials])

  useEffect(() => {
    if (!activeProjectId) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveProject(), 1000)
    return () => clearTimeout(saveTimer.current)
  }, [project, protection, workData, materials, saveProject, activeProjectId])

  const handleCreateProject = async (name) => {
    try {
      const p = await api.createProject({
        name,
        protection: INITIAL_PROTECTION,
        workData: getInitialWorkData(),
        materials: INITIAL_MATERIALS,
      })
      await loadProjects()
      loadProject(p._id)
    } catch {
      // silent
    }
  }

  const handleDeleteProject = async (id) => {
    try {
      await api.deleteProject(id)
      if (activeProjectId === id) {
        setActiveProjectId(null)
        setProject(INITIAL_PROJECT)
        setProtection(INITIAL_PROTECTION)
        setWorkData(getInitialWorkData())
        setMaterials(INITIAL_MATERIALS)
        setActiveTab('projects')
      }
      await loadProjects()
    } catch {
      // silent
    }
  }

  const updateWork = (roomKey, fieldName, value) => {
    setWorkData((prev) => ({
      ...prev,
      [roomKey]: { ...prev[roomKey], [fieldName]: value },
    }))
  }

  const handleClearAll = async () => {
    if (!activeProjectId) return
    if (window.confirm('Clear all data for this project? This cannot be undone.')) {
      setProject(INITIAL_PROJECT)
      setProtection(INITIAL_PROTECTION)
      setWorkData(getInitialWorkData())
      setMaterials(INITIAL_MATERIALS)
    }
  }

  if (authLoading) {
    return (
      <div className="app-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  const stats = {
    total: ROOM_CONFIGS.length,
    pending: ROOM_CONFIGS.filter((r) => workData[r.key]?.status === 'pending').length,
    inProgress: ROOM_CONFIGS.filter((r) => workData[r.key]?.status === 'in-progress').length,
    completed: ROOM_CONFIGS.filter((r) => workData[r.key]?.status === 'completed').length,
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Renovation Daily Schedule</h1>
          <p className="header-subtitle">
            Project Work Tracker
            {saving && <span className="save-indicator"> — Saving...</span>}
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card stat-total">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card stat-pending">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card stat-progress">
            <span className="stat-number">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card stat-done">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Done</span>
          </div>
        </div>
        <div className="header-user">
          <span className="user-name">{user.fullName || user.username}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            disabled={tab.key !== 'projects' && !activeProjectId}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'projects' && (
          <ProjectSelector
            projects={projects}
            activeProjectId={activeProjectId}
            onSelect={loadProject}
            onCreate={handleCreateProject}
            onDelete={handleDeleteProject}
            loading={projectsLoading}
          />
        )}

        {activeTab === 'info' && activeProjectId && (
          <ProjectInfo project={project} setProject={setProject} />
        )}

        {activeTab === 'protection' && activeProjectId && (
          <ProtectionForm protection={protection} setProtection={setProtection} />
        )}

        {activeTab === 'work' && activeProjectId && (
          <div className="work-sections">
            {ROOM_CONFIGS.map((room) => (
              <WorkSection
                key={room.key}
                config={room}
                data={workData[room.key]}
                onChange={(field, value) => updateWork(room.key, field, value)}
              />
            ))}
          </div>
        )}

        {activeTab === 'materials' && activeProjectId && (
          <MaterialsList materials={materials} setMaterials={setMaterials} />
        )}

        {activeTab === 'view' && activeProjectId && (
          <ScheduleView
            project={project}
            protection={protection}
            workData={workData}
            materials={materials}
            roomConfigs={ROOM_CONFIGS}
          />
        )}
      </main>

      <footer className="app-footer">
        {activeProjectId && (
          <button className="btn-clear" onClick={handleClearAll}>
            Clear All Data
          </button>
        )}
        <span className="footer-note">Data saved to server automatically</span>
      </footer>
    </div>
  )
}

export default App
