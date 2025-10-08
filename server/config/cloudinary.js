import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary using the CLOUDINARY_URL
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true, // All connections should be secure
  });
} else {
  console.error("❌ CLOUDINARY_URL is not set. Please provide the Cloudinary connection string.");
}

// Upload image to Cloudinary
export const uploadImage = async (filePath) => {
  try {
    if (!process.env.CLOUDINARY_URL) {
      throw new Error("Cloudinary is not configured.");
    }
    // Upload the image
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'clutchzone', // Optional: organize uploads in a specific folder
      resource_type: 'auto', // Automatically detect the resource type
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary.');
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    if (!process.env.CLOUDINARY_URL) {
      throw new Error("Cloudinary is not configured.");
    }
    // Delete the image
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary.');
  }
};

export default cloudinary;