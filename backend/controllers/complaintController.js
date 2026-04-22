// Full PNGRB Compliant Complaint Controller
const Complaint = require('../models/Complaint');
const { sendNotification } = require('../utils/notifications');
const cloudinary = require('cloudinary').v2;
const QRCode = require('qrcode');

exports.createComplaint = async (req, res) => {
  try {
    const { category, title, description, sos = false, tatDays = sos ? 1 : 3 } = req.body;
    
    // Generate unique ID
    const complaintId = 'PNGRB' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    // Generate QR
    const qrData = JSON.stringify({ complaintId, userId: req.user.id });
    const qrCodeDataURL = await QRCode.toDataURL(qrData);

    const complaint = new Complaint({
      complaintId,
      user: req.user.id,
      category,
      title,
      description,
      sos,
      tatDays,
      qrCodeData: qrCodeDataURL,
      status: sos ? 'SOS-Emergency' : 'New'
    });

    await complaint.save();
    
    // Notification
    sendNotification(req.user, `Complaint ${complaintId} registered. Track via QR.`);

    res.status(201).json({
      message: 'Complaint registered successfully',
      complaint,
      qrCode: qrCodeDataURL
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to create complaint', error: err.message });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching complaints' });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ 
      $or: [{ complaintId: req.params.id }, { _id: req.params.id }]
    }).populate('user', 'name email');
    
    if (!complaint) return res.status(404).json({ msg: 'Complaint not found' });
    
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ msg: 'Error' });
  }
};

exports.escalateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);
    
    if (!complaint || complaint.escalationLevel >= 3) {
      return res.status(400).json({ msg: 'Cannot escalate further' });
    }

    complaint.escalationLevel += 1;
    complaint.status = 'Escalated';
    complaint.tatDays = [3, 7, 15, 30][complaint.escalationLevel];
    await complaint.save();

    sendNotification(complaint.user, `Complaint ${complaint.complaintId} escalated to Tier ${complaint.escalationLevel}`);
    
    res.json({ message: 'Complaint escalated', complaint });
  } catch (err) {
    res.status(500).json({ msg: 'Escalation failed' });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    // Cloudinary upload (stubs for now)
    const fileUrl = 'https://via.placeholder.com/300x200'; // Replace with Cloudinary
    
    res.json({ url: fileUrl });
  } catch (err) {
    res.status(500).json({ msg: 'Upload failed' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const complaint = await Complaint.findById(id);
    complaint.status = status;
    if (status === 'Resolved') complaint.resolvedAt = new Date();
    await complaint.save();

    res.json({ message: 'Status updated', complaint });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed' });
  }
};
