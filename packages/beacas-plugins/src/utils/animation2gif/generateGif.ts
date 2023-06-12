import workletURL from "gif.js/dist/gif.worker.js?url";
import GIF from "gif.js";

export interface GenerateGifOptions {
  images: Array<HTMLImageElement>;
  gif?: GIF.Options;
  perFrameTime?: number;
  autoSize?: boolean;
}
export const generateGif = (options: GenerateGifOptions): Promise<Blob> => {
  const {
    perFrameTime = 1000 / 24,
    gif: gifOption,
    images,
    autoSize,
  } = options;

  const params = { ...gifOption };

  const framesOption: {
    frame: HTMLImageElement | HTMLCanvasElement;
    delay: number;
  }[] = [];

  if (autoSize) {
    const width =
      gifOption?.width || Math.min(...images.map((item) => item.width));
    const height =
      gifOption?.height || Math.min(...images.map((item) => item.height));
    params.width = width;
    params.height = height;
  }

  images.forEach((item) => {
    framesOption.push({
      frame: item,
      delay: perFrameTime,
    });
  });

  return new Promise((resolve) => {
    const gif = new GIF({
      workers: 2,
      quality: 1,
      workerScript: workletURL,
      ...params,
    });

    framesOption.forEach((item) => {
      gif.addFrame(item.frame, {
        delay: item.delay,
      });
    });

    gif.on("finished", function (blob) {
      resolve(blob);
    });

    gif.render();
  });
};
