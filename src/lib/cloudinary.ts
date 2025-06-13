import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload files
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'hiringbooth',
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          transformation: resourceType === 'image' ? [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto:best' },
            { format: 'auto' }
          ] : undefined
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    throw new Error(`Upload failed: ${error}`);
  }
};

// Helper function to delete files
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Delete failed: ${error}`);
  }
};
