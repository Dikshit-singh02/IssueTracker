const Complaint = require('../models/Complaint');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const match = { user: req.user.id };
    if (req.user.role === 'Admin') match.user = { $exists: true };
    if (req.user.role === 'NodalOfficer') match.escalationLevel = 1;

    const stats = await Complaint.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgTat: { $avg: { $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 86400000] } }
        }
      },
      { $group: { _id: null, stats: { $push: '$$ROOT' }, total: { $sum: '$count' } } }
    ]);

    res.json({
      stats: stats[0]?.stats || [],
      total: stats[0]?.total || 0,
      role: req.user.role
    });
  } catch (err) {
    res.status(500).json({ msg: 'Dashboard error', err });
  }
};

exports.getAnalytics = async (req, res) => {
  // Admin analytics
  const pipeline = [
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ];
  const categories = await Complaint.aggregate(pipeline);
  res.json({ categories });
};
