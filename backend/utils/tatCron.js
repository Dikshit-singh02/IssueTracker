// Auto TAT Escalation & Compensation
const cron = require('node-cron');
const Complaint = require('../models/Complaint');

const TAT_DAYS = [3, 7, 15, 30]; // Per escalation level

const checkTAT = async () => {
  try {
    console.log('🔄 Checking TAT breaches...');
    const overdue = await Complaint.find({
      status: { $nin: ['Resolved', 'Closed'] },
      escalationLevel: { $lt: 3 }
    });

    for (let comp of overdue) {
      const daysElapsed = Math.floor((Date.now() - comp.createdAt) / (1000 * 60 * 60 * 24));
      const tat = TAT_DAYS[comp.escalationLevel];
      
      if (daysElapsed > tat) {
        comp.escalationLevel += 1;
        comp.status = 'Escalated';
        comp.compensation += 100 * comp.escalationLevel; // Rs100 per level delay
        await comp.save();
        console.log(`📈 Escalated ${comp.complaintId} to level ${comp.escalationLevel}`);
        // TODO: sendNotification(comp);
      }
    }
  } catch (err) {
    console.error('TAT Cron Error:', err);
  }
};

const startTATCron = () => {
  cron.schedule('0 */6 * * *', checkTAT); // Every 6 hours
  console.log('⏰ TAT Cron started');
};

module.exports = { startTATCron, checkTAT };
