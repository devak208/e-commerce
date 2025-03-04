const express = require('express');
const router = express.Router();
const bannerController = require('../../controllers/Banners/bannerController');
const upload = require('../../middleware/Uploads/upload');

// Existing routes
router.get('/', bannerController.getAllBanners);
router.post('/', upload.single('image'), bannerController.createBanner);
router.delete('/:id', bannerController.deleteBanner);
router.put('/:id', upload.single('image'), bannerController.updateBanner);

module.exports = router;
