const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.get('/', doctorController.getDoctors);

// ✅ Must come BEFORE /:id to avoid "stats" being treated as an ID
router.get('/stats', auth, rbac(['doctor']), doctorController.getDoctorStats);
router.get('/profile/data', auth, rbac(['doctor']), doctorController.getMyProfile);
router.get('/get/patient', auth, rbac(['doctor']), doctorController.GetPatients);

router.get('/:id', doctorController.getDoctorById);
router.get('/get/:id', auth, doctorController.getDoctorByIdAuth);

router.use(auth);

router.post('/', rbac(['doctor']), doctorController.createProfile);
router.put('/profile/upload/data', rbac(['doctor']), doctorController.updateDoctorData);
router.put('/:id', rbac(['doctor']), doctorController.updateDoctorProfile);
router.put('/availability', rbac(['doctor']), doctorController.updateAvailability);

module.exports = router;