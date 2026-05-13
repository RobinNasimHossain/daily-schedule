import { useState, useEffect, useCallback } from 'react'
import ProjectInfo from './components/ProjectInfo'
import ProtectionForm from './components/ProtectionForm'
import WorkSection from './components/WorkSection'
import MaterialsList from './components/MaterialsList'
import ScheduleView from './components/ScheduleView'
import ScheduleList from './components/ScheduleList'
import Toast from './components/Toast'
import {
  fetchSchedules,
  fetchSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  duplicateSchedule,
} from './api/scheduleApi'
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
  { key: 'schedules', label: 'Schedules' },
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

function normalizeWorkData(raw) {
  if (!raw) return getInitialWorkData()
  const base = getInitialWorkData()
  const src = raw instanceof Map ? Object.fromEntries(raw) : raw
  Object.keys(base).forEach((key) => {
    if (src[key]) {
      base[key] = { ...base[key], ...src[key] }
    }
  })
  return base
}

function App() {
  const [activeTab, setActiveTab] = useState('schedules')
  const [schedulesList, setSchedulesList] = useState([])
  const [currentScheduleId, setCurrentScheduleId] = useState(null)
  const [project, setProject] = useState(INITIAL_PROJECT)
  const [protection, setProtection] = useState(INITIAL_PROTECTION)
  const [workData, setWorkData] = useState(getInitialWorkData())
  const [materials, setMaterials] = useState(INITIAL_MATERIALS)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const loadSchedules = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchSchedules()
      setSchedulesList(res.data)
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetchSchedules()
        if (!cancelled) setSchedulesList(res.data)
      } catch {
        // silently ignore initial load errors
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSelectSchedule = async (schedule) => {
    try {
      const res = await fetchSchedule(schedule._id)
      const data = res.data
      setCurrentScheduleId(data._id)
      setProject(data.project || INITIAL_PROJECT)
      setProtection(data.protection || INITIAL_PROTECTION)
      setWorkData(normalizeWorkData(data.workData))
      setMaterials(
        data.materials?.length > 0
          ? data.materials.map((m, i) => ({ ...m, id: m._id || i + 1 }))
          : INITIAL_MATERIALS
      )
      setActiveTab('info')
      showToast('Schedule loaded')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleNewSchedule = () => {
    setCurrentScheduleId(null)
    setProject(INITIAL_PROJECT)
    setProtection(INITIAL_PROTECTION)
    setWorkData(getInitialWorkData())
    setMaterials(INITIAL_MATERIALS)
    setActiveTab('info')
    showToast('New schedule created')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        project,
        protection,
        workData,
        materials: materials.map((m) => ({ name: m.name, quantity: m.quantity, unit: m.unit })),
      }

      if (currentScheduleId) {
        await updateSchedule(currentScheduleId, payload)
        showToast('Schedule updated')
      } else {
        const res = await createSchedule(payload)
        setCurrentScheduleId(res.data._id)
        showToast('Schedule saved')
      }
      await loadSchedules()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id)
      if (currentScheduleId === id) {
        setCurrentScheduleId(null)
        setProject(INITIAL_PROJECT)
        setProtection(INITIAL_PROTECTION)
        setWorkData(getInitialWorkData())
        setMaterials(INITIAL_MATERIALS)
      }
      await loadSchedules()
      showToast('Schedule deleted')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const handleDuplicate = async (id) => {
    try {
      await duplicateSchedule(id)
      await loadSchedules()
      showToast('Schedule duplicated')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  const updateWork = (roomKey, fieldName, value) => {
    setWorkData((prev) => ({
      ...prev,
      [roomKey]: { ...prev[roomKey], [fieldName]: value },
    }))
  }

  const handleClearAll = () => {
    if (window.confirm('Clear all form data? This cannot be undone.')) {
      setProject(INITIAL_PROJECT)
      setProtection(INITIAL_PROTECTION)
      setWorkData(getInitialWorkData())
      setMaterials(INITIAL_MATERIALS)
      setCurrentScheduleId(null)
    }
  }

  const stats = {
    total: ROOM_CONFIGS.length,
    pending: ROOM_CONFIGS.filter((r) => workData[r.key]?.status === 'pending').length,
    inProgress: ROOM_CONFIGS.filter((r) => workData[r.key]?.status === 'in-progress').length,
    completed: ROOM_CONFIGS.filter((r) => workData[r.key]?.status === 'completed').length,
  }

  const isEditing = activeTab !== 'schedules' && activeTab !== 'view'

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Renovation Daily Schedule</h1>
          <p className="header-subtitle">
            {currentScheduleId
              ? `Editing: ${project.id || 'Untitled'}`
              : 'MERN Project Work Tracker'}
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

      <main className="main-content">
        {activeTab === 'schedules' && (
          <ScheduleList
            schedules={schedulesList}
            loading={loading}
            onSelect={handleSelectSchedule}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onCreate={handleNewSchedule}
          />
        )}

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
          {isEditing && (
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : currentScheduleId ? 'Update Schedule' : 'Save Schedule'}
            </button>
          )}
        </div>
        <span className="footer-note">
          {currentScheduleId ? 'Connected to MongoDB' : 'Data saved to MongoDB'}
        </span>
      </footer>

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </div>
  )
}

export default App
