// Settings model for website configuration
export class Settings {
  constructor() {
    // Default settings
    this.settings = {
      logo: {
        url: '/images/logo.png',
        alt: 'ClutchZone Logo'
      },
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        whatsapp: '01500978111'
      },
      theme: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#F59E0B',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        headerColor: '#111827',
        footerColor: '#374151'
      },
      contact: {
        phone: '01500978111',
        email: 'clutchzone97@gmail.com',
        address: ''
      },
      siteInfo: {
        title: 'ClutchZone',
        description: 'منصة شراء وبيع السيارات والعقارات',
        keywords: 'سيارات, عقارات, بيع, شراء'
      }
    };
  }

  // Get all settings
  getSettings() {
    return this.settings;
  }

  // Update logo
  updateLogo(logoData) {
    this.settings.logo = { ...this.settings.logo, ...logoData };
    return this.settings.logo;
  }

  // Update social media links
  updateSocialMedia(socialData) {
    this.settings.socialMedia = { ...this.settings.socialMedia, ...socialData };
    return this.settings.socialMedia;
  }

  // Update theme colors
  updateTheme(themeData) {
    this.settings.theme = { ...this.settings.theme, ...themeData };
    return this.settings.theme;
  }

  // Update contact information
  updateContact(contactData) {
    this.settings.contact = { ...this.settings.contact, ...contactData };
    return this.settings.contact;
  }

  // Update site information
  updateSiteInfo(siteData) {
    this.settings.siteInfo = { ...this.settings.siteInfo, ...siteData };
    return this.settings.siteInfo;
  }

  // Update specific setting
  updateSetting(category, key, value) {
    if (this.settings[category]) {
      this.settings[category][key] = value;
      return this.settings[category];
    }
    throw new Error(`Category ${category} not found`);
  }
}

// Create singleton instance
const settingsInstance = new Settings();
export default settingsInstance;