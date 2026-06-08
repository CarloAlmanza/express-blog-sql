const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/posts', postController.index);
router.get('/posts/:id', postController.show);
router.delete('/posts/:id', postController.destroy);
router.post('/posts', postController.create); // Bonus

module.exports = router;