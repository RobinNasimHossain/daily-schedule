import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    quantity: { type: String, default: '' },
    unit: { type: String, default: 'pcs' },
  },
  { _id: false }
)

const workItemSchema = new mongoose.Schema(
  {
    status: { type: String, default: 'pending', enum: ['pending', 'in-progress', 'completed'] },
    assignedDate: { type: String, default: '' },
    worker: { type: String, default: '' },
  },
  { _id: false, strict: false }
)

const protectionSchema = new mongoose.Schema(
  {
    floorProtection: { type: String, default: '' },
    plywoodWalking: { type: String, default: '' },
    pvcMainDoor: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { _id: false }
)

const scheduleSchema = new mongoose.Schema(
  {
    project: {
      id: { type: String, default: '' },
      company: { type: String, default: '' },
      address: { type: String, default: '' },
      lockCode: { type: String, default: '' },
      date: { type: String, default: '' },
      projectType: { type: String, default: '' },
    },
    protection: { type: protectionSchema, default: () => ({}) },
    workData: { type: Map, of: workItemSchema, default: () => new Map() },
    materials: [materialSchema],
  },
  { timestamps: true }
)

scheduleSchema.index({ 'project.company': 1 })
scheduleSchema.index({ createdAt: -1 })

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema)
