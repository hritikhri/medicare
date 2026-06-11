const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');
const auth = require('../middleware/auth');

router.use(auth, ['patient']);
router.post('/suggestions', assistantController.getSuggestions);

module.exports = router;