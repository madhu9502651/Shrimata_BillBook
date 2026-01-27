const express = require('express');
const router = express.Router();

// POST /api/share-receipt
router.post('/', async (req, res) => {
  try {
    // Expecting base64 PNG in req.body.pngData
    const { pngData, fileName } = req.body;
    if (!pngData) {
      return res.status(400).json({ success: false, message: 'No PNG data provided' });
    }
    // Here you would save the PNG to disk, cloud, or send it somewhere
    // For demo, just respond with success
    res.json({ success: true, message: 'PNG received', fileName: fileName || 'receipt.png' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
