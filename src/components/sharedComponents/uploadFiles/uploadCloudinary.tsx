import axios from 'axios';

const useCloudinaryUpload = () => {
  interface UploadToCloudinaryResponse {
    secure_url: string;
  }

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'IMC_PRESET'); // Set this in your Cloudinary settings

    // Automatically detect file type
    let resourceType: 'raw' | 'image' | 'video' = 'raw';
    if (file.type.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video';
    }

    try {
      const res = await axios.post<UploadToCloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/dw3rzftte/${resourceType}/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  return { uploadToCloudinary };
};

export { useCloudinaryUpload };
