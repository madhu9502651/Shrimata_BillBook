const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { authMiddleware } = require('../middleware/auth');

// Get all data (optionally filtered by type)
router.get('/', authMiddleware, async (req, res) => {
	try {
		const filter = {};
		if (req.query.type) filter.type = req.query.type;
		if (req.query.startDate || req.query.endDate) {
			filter.createdAt = {};
			if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
			if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
		}
		const data = await Data.find(filter).sort({ createdAt: -1 });
		res.json({ data });
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch data' });
	}
});

// Get single record
router.get('/:id', authMiddleware, async (req, res) => {
	try {
		const record = await Data.findById(req.params.id);
		if (!record) return res.status(404).json({ error: 'Record not found' });
		res.json({ data: record });
	} catch (err) {
		res.status(400).json({ error: 'Invalid ID format' });
	}
});

// Create new record
router.post('/', authMiddleware, async (req, res) => {
	try {
		const record = new Data({ ...req.body, createdBy: req.user.userId });
		await record.save();
		res.status(201).json({ data: record });
	} catch (err) {
		res.status(400).json({ error: 'Failed to create record' });
	}
});

// Update record
router.put('/:id', authMiddleware, async (req, res) => {
	try {
		const record = await Data.findByIdAndUpdate(
			req.params.id,
			{ ...req.body, updatedAt: new Date() },
			{ new: true }
		);
		if (!record) return res.status(404).json({ error: 'Record not found' });
		res.json({ data: record });
	} catch (err) {
		res.status(400).json({ error: 'Invalid ID format' });
	}
});

// Delete record (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
	try {
		if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
		const result = await Data.findByIdAndDelete(req.params.id);
		if (!result) return res.status(404).json({ error: 'Record not found' });
		res.json({ message: 'Record deleted successfully' });
	} catch (err) {
		res.status(400).json({ error: 'Invalid ID format' });
	}
});

module.exports = router;
