const EMPTY_IMAGE = 'AA==';

export const toImageSrc = (image: string) =>
  image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;

export const postImageSrc = (image?: string | null) =>
  image && image !== EMPTY_IMAGE ? toImageSrc(image) : null;

export const fileToBytes = (file: File) =>
  new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

export const fileToJpegDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image could not be loaded'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
