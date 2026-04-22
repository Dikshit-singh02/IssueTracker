const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  escalateComplaint,
  uploadFile,
  updateStatus
} = require('../controllers/complaintController');

const router = express.Router();

// Protected routes
router.use(auth);

router.post('/', createComplaint);
router.get('/my', getMyComplaints);
router.get('/:id', getComplaintById);
router.get('/', roleCheck(['Admin', 'NodalOfficer']), getMyComplaints);

router.put('/:id/escalate', escalateComplaint);
router.put('/:id/status', updateStatus);
router.post('/:id/upload', uploadFile);

module.exports = router;
