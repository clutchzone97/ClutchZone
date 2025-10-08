import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  logo: {
    url: String,
    public_id: String,
  },
  contact: {
    phone: String,
    email: String,
    address: String,
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
  },
  siteInfo: {
    title: String,
    description: String,
  },
  theme: {
    primaryColor: String,
    secondaryColor: String,
  }
}, { timestamps: true });

// Ensure there is only one settings document (singleton pattern)
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      siteInfo: {
        title: "ClutchZone",
        description: "Your new home and car are here."
      }
    });
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;