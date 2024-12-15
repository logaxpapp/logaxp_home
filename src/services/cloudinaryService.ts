const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!cloudName || !uploadPreset) {
  throw new Error('Cloudinary environment variables are not set');
}

/**
 * Upload a single image to Cloudinary
 * @param {File} file - A single image file
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error.message || 'Failed to upload image');
  }

  return data.secure_url;
};

/**
 * Upload multiple images to Cloudinary
 * @param {File[]} files - An array of image files
 * @returns {Promise<string[]>} - An array of secure URLs for uploaded images
 */
export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  try {
    // Use the existing uploadImage function for each file
    const uploadPromises = files.map((file) => uploadImage(file));
    // Wait for all uploads to complete
    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls;
  } catch (error) {
    throw new Error(`Failed to upload multiple images: ${(error as Error).message}`);
  }
};
