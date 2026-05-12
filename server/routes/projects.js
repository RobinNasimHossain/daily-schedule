const express = require('express');
const Project = require('../models/Project');
const protect = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/projects — list user's projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/projects — create project
router.post('/', async (req, res) => {
  try {
    const { name, company, address, lockCode, projectDate, projectType, protection, workData, materials } = req.body;

    const project = await Project.create({
      user: req.user._id,
      name,
      company,
      address,
      lockCode,
      projectDate,
      projectType,
      protection: protection || {},
      workData: workData || {},
      materials: materials || [],
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/projects/:id — get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/projects/:id — update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const allowedFields = ['name', 'company', 'address', 'lockCode', 'projectDate', 'projectType', 'protection', 'workData', 'materials'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/projects/:id — delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
