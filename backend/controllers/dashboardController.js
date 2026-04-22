const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Enhanced professional dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const match = { user: req.user.id };
    if (req.user.role === 'Admin') {
      delete match.user; // All complaints for admin
    } else if (req.user.role === 'NodalOfficer') {
      match.escalationLevel = 1;
    }

    // Status stats
    const statusStats = await Complaint.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgResolutionDays: { $avg: { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 86400000] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Category stats
    const categoryStats = await Complaint.aggregate([
      { $match: match },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Escalation stats
    const escalationStats = await Complaint.aggregate([
      { $match: match },
      { $group: { _id: '$escalationLevel', count: { $sum: 1 }, avgTatBreach: { $avg: '$tatDays' } } }
    ]);

    // Recent complaints (last 10)
    const recent = await Complaint.find(match)
      .sort({ createdAt: -1 })
      .limit(10)
      .select('complaintId title status escalationLevel createdAt')
      .lean();

    // TAT breaches (overdue)
    const breaches = await Complaint.countDocuments({
      ...match,
      status: { $nin: ['Resolved', 'Closed'] },
      $expr: { $gt: [{ $divide: [{ $subtract: [new Date(), '$createdAt'] }, 86400000] }, '$tatDays'] }
    });

    const totalComplaints = await Complaint.countDocuments(match);
    const overduePercent = totalComplaints ? Math.round((breaches / totalComplaints) * 100) : 0;

    res.json({
      totalComplaints,
      overduePercent,
      breaches,
      statusStats,
      categoryStats,
      escalationStats,
      recent,
      avgResolutionDays: statusStats.find(s => s._id === 'Resolved')?.avgResolutionDays || 0,
      role: req.user.role
    });
  } catch (err) {
    res.status(500).json({ msg: 'Dashboard error', err: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  // Monthly trend
  const monthlyTrend = await Complaint.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.json({ monthlyTrend });
};
