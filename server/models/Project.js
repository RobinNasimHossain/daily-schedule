const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, default: '' },
    company: { type: String, default: '' },
    address: { type: String, default: '' },
    lockCode: { type: String, default: '' },
    projectDate: { type: String, default: '' },
    projectType: { type: String, default: '' },
    protection: {
      floorProtection: { type: String, default: '' },
      plywoodWalking: { type: String, default: '' },
      pvcMainDoor: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    workData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    materials: [
      {
        name: { type: String, default: '' },
        quantity: { type: String, default: '' },
        unit: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
