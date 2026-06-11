const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const upload = require('../controllers/uploadController').uploadFile;
const rateLimit = require("../middleware/rateLimit");


router.use(auth);

router.put('/update/profilepic', rbac(['patient', 'doctor']),upload,userController.updateProfilePic);
router.put('/update/profile', rbac(['patient', 'doctor']),userController.updateProfile);
router.get('/fetch/profile',rbac(['patient','doctor']),userController.getProfile);
// router.post('/reports', rbac(['patient']), upload, userController.addMedicalReport);
router.post('/notes', rbac(['patient']), userController.addPersonalNote);
router.get('/notifications', rbac(['patient', 'doctor']), userController.getNotifications);


// router.post('/change-password', rateLimit, userController.changePassword);
router.post('/change-password', rateLimit, userController.changePassword);
router.post('/logout-all', userController.logoutAll);
router.delete('/delete-account', userController.deleteAccount);




module.exports = router;