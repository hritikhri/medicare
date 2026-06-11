const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const auth = require('../middleware/auth');

router.use(auth);
router.post('/', uploadFile);

module.exports = router;