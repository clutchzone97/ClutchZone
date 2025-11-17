import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  logoUrl: String,
  primaryColor: { type: String, default: "#1D4ED8" },
  secondaryColor: { type: String, default: "#10B981" },
  phone: String,
  email: String,
  address: String,
  socialLinks: Object,
  heroBackgroundUrl: String,
  carsHeroUrl: String,
  propertiesHeroUrl: String,
  heroSlideIntervalMs: Number,
  heroTitle: String,
  heroSubtitle: String,
  heroTextColor: String,
  heroStrokeColor: String,
  heroStrokeWidth: Number,
  heroTitleColor: String,
  heroTitleStrokeColor: String,
  heroTitleStrokeWidth: Number,
  heroSubtitleColor: String,
  heroSubtitleStrokeColor: String,
  heroSubtitleStrokeWidth: Number,
  logoHeight: Number,
  logoWidth: Number,
  businessHours: String,
  aboutText: String,
  footerText: String,
  headerBgColor: String,
  headerBgOpacity: Number,
  footerBgColor: String,
  headerNavTextColor: String,
  headerNavStrokeColor: String,
  headerNavStrokeWidth: Number
  ,navPillBgColor: String,
  navPillBgOpacity: Number
  ,footerLogoUrl: String,
  footerLogoHeight: Number,
  footerLogoWidth: Number
}, { timestamps: true });

export default mongoose.model("Settings", settingsSchema);
