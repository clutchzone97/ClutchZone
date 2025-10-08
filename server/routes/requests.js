import express from 'express';
import mongoose from 'mongoose';
import Request from '../models/Request.js';

const router = express.Router();

// GET all requests
router.get('/', async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const requests = await Request.find().sort({ createdAt: -1 });
      res.status(200).json(requests);
    } else {
      res.status(200).json(req.app.locals.inMemoryRequests);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// POST a new request
router.post('/', async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const request = new Request(req.body);
      await request.save();
      res.status(201).json(request);
    } else {
      const newRequest = {
        ...req.body,
        _id: new mongoose.Types.ObjectId().toHexString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      req.app.locals.inMemoryRequests.unshift(newRequest);
      res.status(201).json(newRequest);
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to create request' });
  }
});

// UPDATE request status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (req.app.locals.isMongoConnected) {
            const request = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });
            if (!request) return res.status(404).json({ message: 'Request not found' });
            res.status(200).json(request);
        } else {
            const index = req.app.locals.inMemoryRequests.findIndex(r => r._id === req.params.id);
            if (index === -1) return res.status(404).json({ message: 'Request not found' });
            req.app.locals.inMemoryRequests[index].status = status;
            res.status(200).json(req.app.locals.inMemoryRequests[index]);
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to update request status' });
    }
});

// DELETE a request
router.delete('/:id', async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
        const request = await Request.findByIdAndDelete(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.status(200).json({ message: 'Request deleted successfully' });
    } else {
        const index = req.app.locals.inMemoryRequests.findIndex(r => r._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Request not found' });
        req.app.locals.inMemoryRequests.splice(index, 1);
        res.status(200).json({ message: 'Request deleted successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete request' });
  }
});

export default router;