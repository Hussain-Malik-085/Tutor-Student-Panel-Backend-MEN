import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
const uploadToCloudinary = async (localfilePath) => {
try {
    if (!localfilePath) return { status: 0, error: 'No file path provided' };
    
    // Ensure the file exists before uploading
    const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'auto'  // Automatically detect the file type (image, video, etc.)
    }
    );
    console.log('Cloudinary upload result:', result.url);
    return { status: 1, url: result.url };
 

} catch (error) {
    fs.unlinkSync(localfilePath); // Delete the local file in case of error
    console.error('Error uploading to Cloudinary:', error);
    return { status: 0, error: 'Failed to upload to Cloudinary' };
}
};
export { uploadToCloudinary };

export default cloudinary;  