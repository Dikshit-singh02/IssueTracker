const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true }, // Gas supply, billing, safety etc PNGRB categories
  title: { type: String, required: true },
  description: { type: String, required: true },
  files: [{ url: String, publicId: String }],
  status: { type: String, enum: ['New', 'InProgress', 'Resolved', 'Closed', 'Escalated'], default: 'New' },
  escalationLevel: { type: Number, min: 0, max: 3, default: 0 }, // 0:CustomerCare,1:Nodal,2:Appellate,3:IGMS
  tatDays: { type: Number, default: 3 }, // Time at level
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolvedAt: Date,
  sos: { type: Boolean, default: false },
  qrCodeData: String,
  paymentId: String,
  compensation: { type: Number, default: 0 }
});

complaintSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.complaintId) {
    this.complaintId = 'CCMS' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
