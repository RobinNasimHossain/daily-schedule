import { useState, useEffect, useCallback } from 'react'
import ProjectInfo from './components/ProjectInfo'
import ProtectionForm from './components/ProtectionForm'
import WorkSection from './components/WorkSection'
import MaterialsList from './components/MaterialsList'
import ScheduleView from './components/ScheduleView'
import ScheduleList from './components/ScheduleList'
import {
  fetchSchedules,
  fetchSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from './api'
import './App.css'

const INITIAL_PROJECT = {
  id: '',
  company: '',
  address: '',
  lockCode: '',
  date: '',
  projectType: '',
}

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

const INITIAL_PROTECTION = {
  floorProtection: '',
  plywoodWalking: '',
  pvcMainDoor: '',
  notes: '',
}

const INITIAL_MATERIALS = [
  { id: 1, name: 'Protection Pad', quantity: '', unit: 'pcs' },
  { id: 2, name: 'Painter Tape', quantity: '', unit: 'rolls' },
  { id: 3, name: 'Plywood', quantity: '', unit: 'sheets' },
  { id: 4, name: 'PVC', quantity: '', unit: 'pcs' },
]

function App() {
  const [view, setView] = useState('list')
  const [schedules, setSchedules] = useState([])
  const [currentId, setCurrentId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [dbConnected, setDbConnected] = useState(true)

  const [activeTab, setActiveTab] = useState('info')
  const [project, setProject] = useState(INITIAL_PROJECT)
  const [protection, setProtection] = useState(INITIAL_PROTECTION)
  const [workData, setWorkData] = useState(getInitialWorkData())
  const [materials, setMaterials] = useState(INITIAL_MATERIALS)

  const loadSchedulesRef = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchSchedules()
      setSchedules(data)
      setDbConnected(true)
    } catch (err) {
      console.error('Failed to load schedules:', err)
      setDbConnected(false)
      setError('Could not connect to server. Working offline with local storage.')
      const saved = localStorage.getItem('renovation-schedule')
      if (saved) {
        const local = JSON.parse(saved)
        setSchedules(local.list || [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const data = await fetchSchedules()
        if (!cancelled) {
          setSchedules(data)
          setDbConnected(true)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load schedules:', err)
          setDbConnected(false)
          setError('Could not connect to server. Working offline with local storage.')
          const saved = localStorage.getItem('renovation-schedule')
          if (saved) {
            const local = JSON.parse(saved)
            setSchedules(local.list || [])
          }
          setLoading(false)
        }
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  const loadScheduleDetail = async (id) => {
    try {
      setLoading(true)
      const data = await fetchSchedule(id)
      setProject(data.project || INITIAL_PROJECT)
      setProtection(data.protection || INITIAL_PROTECTION)
      const wd = data.workData || {}
      const merged = getInitialWorkData()
      Object.keys(wd).forEach((key) => {
        if (merged[key]) {
          merged[key] = { ...merged[key], ...wd[key] }
        }
      })
      setWorkData(merged)
      setMaterials(
        (data.materials || []).map((m, i) => ({ ...m, id: i + 1 }))
      )
      setCurrentId(data._id)
      setView('edit')
      setActiveTab('info')
    } catch (err) {
      console.error('Failed to load schedule:', err)
      setError('Failed to load project details')
    } finally {
      setLoading(false)
    }
  }

  const saveToLocal = () => {
    const state = { project, protection, workData, materials }
    localStorage.setItem('renovation-schedule', JSON.stringify(state))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const payload = {
      project,
      protection,
      workData,
      materials: materials.map(({ name, quantity, unit }) => ({ name, quantity, unit })),
    }

    try {
      if (dbConnected) {
        if (currentId) {
          await updateSchedule(currentId, payload)
        } else {
          const created = await createSchedule(payload)
          setCurrentId(created._id)
        }
      }
      saveToLocal()
      await loadSchedulesRef()
    } catch (err) {
      console.error('Failed to save:', err)
      saveToLocal()
      setError('Saved locally. Server sync failed — will retry next time.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      if (dbConnected) {
        await deleteSchedule(id)
      }
      await loadSchedulesRef()
    } catch (err) {
      console.error('Failed to delete:', err)
      setError('Failed to delete project')
    }
  }

  const handleNew = () => {
    setProject(INITIAL_PROJECT)
    setProtection(INITIAL_PROTECTION)
    setWorkData(getInitialWorkData())
    setMaterials(INITIAL_MATERIALS)
    setCurrentId(null)
    setView('edit')
    setActiveTab('info')
  }

  const handleBack = () => {
    setView('list')
    loadSchedulesRef()
  }

  const updateWork = (roomKey, fieldName, value) => {
    setWorkData((prev) => ({
      ...prev,
      [roomKey]: { ...prev[roomKey], [fieldName]: value },
    }))
  }

  const handleClearAll = () => {
    if (window.confirm('Clear all fields? This will reset the current form.')) {
      setProject(INITIAL_PROJECT)
      setProtection(INITIAL_PROTECTION)
      setWorkData(getInitialWorkData())
      setMaterials(INITIAL_MATERIALS)
    }
  }

  const stats = {
    total: ROOM_CONFIGS.length,
    pending: ROOM_CONFIGS.filter((r) => workData[r.key]?.status === 'pending').length,
    inProgress: ROOM_CONFIGS.filter((r) => workData[r.key]?.status === 'in-progress').length,
    completed: ROOM_CONFIGS.filter((r) => workData[r.key]?.status === 'completed').length,
  }

  if (view === 'list') {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>Renovation Daily Schedule</h1>
            <p className="header-subtitle">Project Work Tracker — MERN Stack</p>
          </div>
          <div className="header-stats">
            <div className="stat-card stat-total">
              <span className="stat-number">{schedules.length}</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <main className="main-content">
          <ScheduleList
            schedules={schedules}
            loading={loading}
            onSelect={loadScheduleDetail}
            onDelete={handleDelete}
            onCreate={handleNew}
          />
        </main>

        <footer className="app-footer">
          <span className="footer-note">
            {dbConnected
              ? 'Connected to MongoDB'
              : 'Offline mode — data saved locally'}
          </span>
        </footer>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Renovation Daily Schedule</h1>
          <p className="header-subtitle">
            {currentId ? 'Edit Project' : 'New Project'}
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
      </header>

      <nav className="tab-nav">
        <button className="tab-btn back-btn" onClick={handleBack}>
          &#8592; Back
        </button>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {error && <div className="error-banner">{error}</div>}

      <main className="main-content">
        {activeTab === 'info' && (
          <ProjectInfo project={project} setProject={setProject} />
        )}

        {activeTab === 'protection' && (
          <ProtectionForm protection={protection} setProtection={setProtection} />
        )}

        {activeTab === 'work' && (
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

        {activeTab === 'materials' && (
          <MaterialsList materials={materials} setMaterials={setMaterials} />
        )}

        {activeTab === 'view' && (
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
        <div className="footer-left">
          <button className="btn-clear" onClick={handleClearAll}>
            Clear Form
          </button>
        </div>
        <div className="footer-right">
          <span className="footer-note">
            {dbConnected ? 'MongoDB' : 'Offline'}
          </span>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : currentId ? 'Update Project' : 'Save Project'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default App
