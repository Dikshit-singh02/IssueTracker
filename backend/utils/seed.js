const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
require('dotenv').config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Clear existing
  await Complaint.deleteMany({});

  // Sample users
  const users = await User.find({}, {_id: 1});

  // Sample complaints
  const complaints = [
    { user: users[0]?._id, complaintId: 'PNG001', title: 'Billing Issue', category: 'Billing', status: 'Open', escalationLevel: 0, tatDays: 3 },
    { user: users[0]?._id, complaintId: 'PNG002', title: 'Service Delay', category: 'Service', status: 'Escalated', escalationLevel: 1, tatDays: 7 },
    // Add 10+ samples...
  ];

  await Complaint.insertMany(complaints);
  console.log('Demo data seeded!');
  process.exit();
};

seedData().catch(console.error);
