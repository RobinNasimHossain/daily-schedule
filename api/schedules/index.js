import connectDB from '../lib/mongodb.js'
import Schedule from '../lib/models/Schedule.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  await connectDB()

  if (req.method === 'GET') {
    const schedules = await Schedule.find().sort({ createdAt: -1 }).lean()
    return res.status(200).json(schedules)
  }

  if (req.method === 'POST') {
    const schedule = await Schedule.create(req.body)
    return res.status(201).json(schedule)
  }

  res.setHeader('Allow', 'GET,POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
