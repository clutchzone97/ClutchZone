import { slugify } from './slugify.js';

/**
 * Generates a unique slug for a document.
 * @param {import('mongoose').Model} Model - The Mongoose model.
 * @param {string} title - The title to slugify.
 * @param {string|null} excludeId - The ID of the document to exclude (for updates).
 * @returns {Promise<string>} - The unique slug.
 */
export async function createUniqueSlug(Model, title, excludeId = null) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    // Check if slug exists
    const exists = await Model.findOne(query).select('_id');
    if (!exists) {
      return slug;
    }
    
    slug = `${baseSlug}-${count}`;
    count++;
  }
}
