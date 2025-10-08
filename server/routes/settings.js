import express from 'express';
import Settings from '../models/Settings.js';

const router = express.Router();

// GET settings
router.get('/', async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      const settings = await Settings.getSingleton();
      res.status(200).json(settings);
    } else {
      // In-memory fallback
      res.status(200).json(req.app.locals.inMemorySettings);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
});

// UPDATE settings
router.put('/', async (req, res) => {
  try {
    if (req.app.locals.isMongoConnected) {
      let settings = await Settings.getSingleton();
      // Update fields from request body, including nested ones
      Object.assign(settings, req.body);
      await settings.save();
      res.status(200).json({ settings, message: 'Settings updated successfully' });
    } else {
      // In-memory fallback
      // Deep merge to handle nested objects like 'contact' and 'socialMedia'
      const updatedSettings = {
        ...req.app.locals.inMemorySettings,
        ...req.body,
        contact: {
          ...req.app.locals.inMemorySettings.contact,
          ...req.body.contact,
        },
        socialMedia: {
          ...req.app.locals.inMemorySettings.socialMedia,
          ...req.body.socialMedia,
        },
        siteInfo: {
            ...req.app.locals.inMemorySettings.siteInfo,
            ...req.body.siteInfo,
        }
      };
      req.app.locals.inMemorySettings = updatedSettings;
      res.status(200).json({ settings: updatedSettings, message: 'Settings updated successfully (in-memory)' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
});

export default router;