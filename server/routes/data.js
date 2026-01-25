const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all data (filtered by role)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const query = {};

    if (type) {
      query.type = type;
    }

    // Date filtering
    if (startDate || endDate) {
      query.$or = [
        { date: {} },
        { order_date: {} },
        { purchase_date: {} },
        { createdAt: {} }
      ];

      if (startDate) {
        const start = new Date(startDate);
        query.$or.forEach(condition => {
          Object.keys(condition).forEach(key => {
            condition[key].$gte = start;
          });
        });
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.$or.forEach(condition => {
          Object.keys(condition).forEach(key => {
            condition[key].$lte = end;
          });
        });
      }
    }

    const data = await Data.find(query).sort({ createdAt: -1 });
    console.log(`[DB] GET all data: found ${data.length} records`);
    res.json({ data });
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Get single record
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const record = await Data.findById(req.params.id);
    console.log(`[DB] GET record by id: ${req.params.id} ${record ? 'FOUND' : 'NOT FOUND'}`);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ data: record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});

// Create new record
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type } = req.body;

    // Users can only create worker records
    if (req.user.role === 'user' && type !== 'worker') {
      return res.status(403).json({ error: 'Users can only add production records' });
    }

    const record = new Data({
      ...req.body,
      createdBy: req.user.userId
    });

    await record.save();
    console.log(`[DB] CREATE record: type=${type}, id=${record._id}`);
    res.status(201).json({ data: record });
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// Update record
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const record = await Data.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Users can only update their own worker records and only today's date
    if (req.user.role === 'user') {
      if (record.type !== 'worker') {
        return res.status(403).json({ error: 'Users can only edit production records' });
      }

      const recordDate = new Date(record.date);
      const today = new Date();
      recordDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (recordDate.getTime() !== today.getTime()) {
        return res.status(403).json({ error: 'You can only edit today\'s production' });
      }
    }

    Object.assign(record, req.body);
    record.updatedAt = new Date();
    await record.save();
    console.log(`[DB] UPDATE record: id=${record._id}`);
    res.json({ data: record });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// Delete record (admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const record = await Data.findByIdAndDelete(req.params.id);
    console.log(`[DB] DELETE record: id=${req.params.id} ${record ? 'SUCCESS' : 'NOT FOUND'}`);
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// Bulk operations (admin only)
router.post('/bulk', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { operation, records } = req.body;

    if (operation === 'create') {
      const created = await Data.insertMany(
        records.map(r => ({ ...r, createdBy: req.user.userId }))
      );
      console.log(`[DB] BULK CREATE: ${created.length} records`);
      res.json({ data: created, count: created.length });
    } else if (operation === 'delete') {
      const result = await Data.deleteMany({ _id: { $in: records } });
      console.log(`[DB] BULK DELETE: deleted ${result.deletedCount} records`);
      res.json({ deletedCount: result.deletedCount });
    } else {
      res.status(400).json({ error: 'Invalid operation' });
    }
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({ error: 'Bulk operation failed' });
  }
});

module.exports = router;
