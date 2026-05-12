import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  quantity: { type: String, default: '' },
  unit: { type: String, default: 'pcs' },
})

const workRoomSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    assignedDate: { type: String, default: '' },
    worker: { type: String, default: '' },
  },
  { strict: false }
)

const protectionSchema = new mongoose.Schema({
  floorProtection: { type: String, default: '' },
  plywoodWalking: { type: String, default: '' },
  pvcMainDoor: { type: String, default: '' },
  notes: { type: String, default: '' },
})

const projectSchema = new mongoose.Schema({
  id: { type: String, default: '' },
  company: { type: String, default: '' },
  address: { type: String, default: '' },
  lockCode: { type: String, default: '' },
  date: { type: String, default: '' },
  projectType: { type: String, default: '' },
})

const scheduleSchema = new mongoose.Schema(
  {
    project: { type: projectSchema, default: () => ({}) },
    protection: { type: protectionSchema, default: () => ({}) },
    workData: { type: Map, of: workRoomSchema, default: () => new Map() },
    materials: { type: [materialSchema], default: [] },
  },
  {
    timestamps: true,
  }
)

scheduleSchema.index({ 'project.id': 1 })
scheduleSchema.index({ 'project.date': -1 })
scheduleSchema.index({ createdAt: -1 })

const Schedule = mongoose.model('Schedule', scheduleSchema)

export default Schedule
