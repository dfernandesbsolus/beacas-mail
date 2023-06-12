import { dom2Svg, img2Blob } from './dom2Svg';
import { generateGif } from './generateGif';

interface AnimationToGIFOption {
  totalTime: number;
  container: HTMLElement;
  frames?: number;
  debug?: boolean;
}

interface AnimationItem {
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options?: number | KeyframeAnimationOptions;
  selector: Parameters<Document['querySelector']>[0];
}

export async function animationToGIF(list: AnimationItem[], options: AnimationToGIFOption): Promise<Blob> {
  const { totalTime, container: sourceContainer, frames = 24, debug = false } = options;
  if (debug) {
    console.time('generate frame');
  }
  const perFrameTime = 1000 / frames;
  const containerWidth = sourceContainer.offsetWidth;
  const containerHeight = sourceContainer.offsetHeight;

  const container = sourceContainer.cloneNode(true) as HTMLElement;

  const hideContainer = document.createElement('div');
  hideContainer.style.width = '0px';
  hideContainer.style.height = '0px';
  hideContainer.style.overflow = 'hidden';

  const wrapper = document.createElement('div');
  wrapper.style.width = containerWidth + 'px';
  wrapper.style.height = containerHeight + 'px';

  wrapper.appendChild(container);
  hideContainer.appendChild(wrapper);
  document.body.appendChild(hideContainer);

  const animationList = list.map(item => {
    const node = container.querySelector(item.selector);
    if (!node) {
      throw new Error(`Can not find node by ${item.selector}`);
    }
    const animation = node.animate(item.keyframes, item.options);
    animation.pause();
    return animation;
  });

  const framesImages: string[] = [];

  new Array(totalTime / perFrameTime).fill(0).map(async (_, index) => {
    animationList.forEach(animation => {
      animation.currentTime = perFrameTime * index;
    });
    const html = await dom2Svg(container, {
      width: containerWidth,
      height: containerHeight
    });
    framesImages.push(html);
  });

  if (debug) {
    console.timeEnd('generate frame');
  }
  if (debug) {
    console.time('generate GIF');
    console.log(framesImages);
  }

  const imageList: HTMLImageElement[] = await Promise.all(
    framesImages.map(svg => {
      return new Promise<InstanceType<typeof Image>>(resolve => {
        const img = new Image();
        img.width = containerWidth;
        img.height = containerHeight;
        img.onload = () => {
          resolve(img);
        };

        img.src = svg;
      });
    }));

  if (imageList.length === 1) {
    return img2Blob(imageList[0]);
  }

  const blob = await generateGif({
    images: imageList,
    perFrameTime: perFrameTime
  });

  if (debug) {
    console.timeEnd('generate GIF');
  }

  document.body.removeChild(hideContainer);
  return blob;
}