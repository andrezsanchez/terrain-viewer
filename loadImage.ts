const canvas = document.createElement('canvas');
const context = <CanvasRenderingContext2D> canvas.getContext('2d');
if (!context) {
  throw new Error('Could not create 2D context');
}

export function loadImage(url:string):Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener(
      'load',
      () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        resolve(context.getImageData(0, 0, image.width, image.height));
      },
      false
    );

    image.addEventListener('error', error => {
      reject(new Error('Failed to load image'));
    });

    image.crossOrigin = 'anonymous';
    image.src = url;
  });
}
