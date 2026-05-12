import express from 'express'
import Schedule from '../models/Schedule.js'

const router = express.Router()

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

router.get('/', async (req, res, next) => {
  try {
    const { search, status, sort = '-createdAt', page = 1, limit = 20 } = req.query
    const query = {}

    if (search) {
      const escaped = escapeRegex(search)
      query.$or = [
        { 'project.id': { $regex: escaped, $options: 'i' } },
        { 'project.company': { $regex: escaped, $options: 'i' } },
        { 'project.address': { $regex: escaped, $options: 'i' } },
      ]
    }

    if (status) {
      query['workData.status'] = status
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [schedules, total] = await Promise.all([
      Schedule.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Schedule.countDocuments(query),
    ])

    res.json({
      success: true,
      data: schedules,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' })
    }
    res.json({ success: true, data: schedule })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const schedule = await Schedule.create(req.body)
    res.status(201).json({ success: true, data: schedule })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' })
    }
    res.json({ success: true, data: schedule })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id)
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' })
    }
    res.json({ success: true, data: {} })
  } catch (error) {
    next(error)
  }
})

router.patch('/:id/work/:roomKey', async (req, res, next) => {
  try {
    const { id, roomKey } = req.params
    const update = {}
    Object.keys(req.body).forEach((key) => {
      update[`workData.${roomKey}.${key}`] = req.body[key]
    })

    const schedule = await Schedule.findByIdAndUpdate(id, { $set: update }, { new: true })
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' })
    }
    res.json({ success: true, data: schedule })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/duplicate', async (req, res, next) => {
  try {
    const original = await Schedule.findById(req.params.id)
    if (!original) {
      return res.status(404).json({ success: false, error: 'Schedule not found' })
    }

    const duplicate = original.toObject()
    delete duplicate._id
    delete duplicate.createdAt
    delete duplicate.updatedAt
    duplicate.project.id = `${duplicate.project.id} (Copy)`

    const newSchedule = await Schedule.create(duplicate)
    res.status(201).json({ success: true, data: newSchedule })
  } catch (error) {
    next(error)
  }
})

export default router
