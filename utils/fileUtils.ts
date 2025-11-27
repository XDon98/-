
interface Base64ConversionResult {
    base64Data: string;
    mimeType: string;
}

// Helper to resize image to avoid API payload limits
const processImage = (source: Blob): Promise<Base64ConversionResult> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(source);
        
        img.onload = () => {
            // Reduced to 512 to prevent "Rpc failed due to xhr error" (payload too large)
            // 512 is sufficient for AI reference and ensures stability when sending multiple images.
            const maxDim = 512; 
            let width = img.width;
            let height = img.height;

            // Resize if larger than max dimensions
            if (width > maxDim || height > maxDim) {
                const scale = maxDim / Math.max(width, height);
                width = Math.round(width * scale);
                height = Math.round(height * scale);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error("Canvas context unavailable"));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            
            // Default to JPEG for better compression unless strictly PNG/WebP
            let mimeType = 'image/jpeg';
            if (source.type === 'image/png' || source.type === 'image/webp') {
                mimeType = source.type;
            }

            // Use 0.7 quality for better compression to keep payload light
            const dataUrl = canvas.toDataURL(mimeType, 0.7);
            const base64Data = dataUrl.split(',')[1];
            
            URL.revokeObjectURL(url);
            resolve({ base64Data, mimeType });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
        };
        
        img.src = url;
    });
};

export const fileToBase64 = (file: File): Promise<Base64ConversionResult> => {
  return processImage(file);
};

export const dataUrlToBase64 = (dataUrl: string): Base64ConversionResult => {
    const parts = dataUrl.split(',');
    if (parts.length !== 2) {
      throw new Error('Invalid data URL');
    }
    const meta = parts[0];
    const base64Data = parts[1];
    
    const mimeMatch = meta.match(/:(.*?);/);
    if (!mimeMatch || mimeMatch.length < 2) {
      throw new Error('Could not extract MIME type from data URL');
    }
    const mimeType = mimeMatch[1];
    
    return { base64Data, mimeType };
};

export const urlToBase64 = (url: string): Promise<Base64ConversionResult> => {
  return new Promise(async (resolve, reject) => {
      try {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
          }
          const blob = await response.blob();
          resolve(await processImage(blob));
      } catch (error) {
          reject(error);
      }
  });
};
