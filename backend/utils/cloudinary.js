const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Manually ensure env vars are logged for debugging (remove in prod)
console.log('--- Cloudinary Config Debug ---');
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API_KEY (Length):', process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.length : 'Missing');
console.log('API_KEY (First 3 chars):', process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.substring(0, 3) : 'Missing');
console.log('-----------------------------');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('WARNING: Cloudinary environment variables are missing. Image uploads will fail.');
}

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        // Fallback for development if keys are missing
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.log('Cloudinary keys missing. Returning mock image URL.');
            return resolve({
                secure_url: 'https://images.unsplash.com/photo-1600596542815-27bfefd0c3c6?auto=format&fit=crop&w=800&q=80',
                public_id: 'mock-id-' + Date.now()
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'real-estate-properties',
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

module.exports = { cloudinary, uploadToCloudinary };
