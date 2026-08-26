export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  duration?: number;
  format?: string;
  width?: number;
  height?: number;
}

export async function uploadToCloudinary(
  fileBase64: string,
  folder: string = "streamflix"
): Promise<CloudinaryUploadResult | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = new URLSearchParams({
      file: fileBase64,
      folder,
      timestamp: timestamp.toString(),
      api_key: apiKey,
    });

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: params,
    });

    if (!res.ok) {
      throw new Error(`Cloudinary upload failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
}
