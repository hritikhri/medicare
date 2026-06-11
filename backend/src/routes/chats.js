const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/:appointmentId', chatController.getChat);
router.post('/:appointmentId', chatController.sendMessage);

module.exports = router;