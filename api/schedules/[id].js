import connectDB from '../lib/mongodb.js'
import Schedule from '../lib/models/Schedule.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  await connectDB()

  if (req.method === 'GET') {
    const schedule = await Schedule.findById(id).lean()
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' })
    return res.status(200).json(schedule)
  }

  if (req.method === 'PUT') {
    const schedule = await Schedule.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).lean()
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' })
    return res.status(200).json(schedule)
  }

  if (req.method === 'DELETE') {
    const schedule = await Schedule.findByIdAndDelete(id)
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' })
    return res.status(200).json({ message: 'Schedule deleted' })
  }

  res.setHeader('Allow', 'GET,PUT,DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
}
