const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createComplaint, getComplaints } = require('../controllers/complaintController');

const router = express.Router();

// Protected routes
router.use(auth);

router.post('/', createComplaint);
router.get('/my', getComplaints);
router.get('/', roleCheck(['Admin', 'NodalOfficer']), getComplaints); // Admin see all

// TODO: PUT /:id/escalate, POST /upload, GET /:id/status etc.

module.exports = router;
