import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
  const settings = await Settings.findOne();
  const obj = settings ? settings.toObject() : {};
  const payload = {
    ...obj,
    aboutText: obj.aboutText || "",
    footerText: obj.footerText || obj.footerAboutText || "",
  };
  res.json(payload);
};

export const updateSettings = async (req, res) => {
  const body = { ...req.body };
  if (body.footerText == null && body.footerAboutText != null) {
    body.footerText = body.footerAboutText;
    delete body.footerAboutText;
  }
  const settings = await Settings.findOneAndUpdate({}, body, { new: true, upsert: true });
  const obj = settings ? settings.toObject() : {};
  res.json({
    ...obj,
    aboutText: obj.aboutText || "",
    footerText: obj.footerText || obj.footerAboutText || "",
  });
};
