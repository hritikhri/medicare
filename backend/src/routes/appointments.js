const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.use(auth);

router.post('/', rbac(['patient']), appointmentController.bookAppointment);
router.get('/', appointmentController.getAppointments);

router.put('/patient/:id/notes', rbac(['doctor']), appointmentController.updatePatientNotes);

router.put('/:id/status', rbac(['doctor']), appointmentController.updateStatus);
router.delete('/:id', rbac(['patient', 'doctor']), appointmentController.cancelAppointment);
router.delete('/:appointmentId/cancel', appointmentController.cancelPatientAppointment);
router.put('/:appointmentId/cancel', appointmentController.cancelAppointment);
router.put('/:appointmentId/complete', appointmentController.completeAppointment);

module.exports = router;    
