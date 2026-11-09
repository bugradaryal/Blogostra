const EMPTY_IMAGE = 'AA==';

export const toImageSrc = (image: string) =>
  image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;

export const postImageSrc = (image?: string | null) =>
  image && image !== EMPTY_IMAGE ? toImageSrc(image) : null;

const MAX_IMAGE_SIDE = 1600;

// Her biçimi (png, webp, gif, avif...) JPEG'e çevirir ve uzun kenarı küçültür;
// böylece sunucuya her zaman küçük ve tek biçimli bir görsel gider.
export const fileToJpegDataUrl = (file: File, maxSide = MAX_IMAGE_SIDE) =>
  new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image could not be loaded'));
    };
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Canvas is not available'));
        return;
      }
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.86));
    };
    img.src = url;
  });
