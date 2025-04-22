export const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
        console.error("Cloudinary credentials are missing!");
        return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) throw new Error("Failed to upload image");

        const data = await response.json();
        console.log(data.secure_url);
        
        return data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return null;
    }
};