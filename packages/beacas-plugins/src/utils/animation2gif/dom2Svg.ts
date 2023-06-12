import { flatMap, get } from "lodash";

// canvas绘制图片元素方法
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d")!;

export const urlToImage = async (url: string) => {
  const img = new Image();
  img.src = url;

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  return img;
};

export const base64ToBlob = async (base64: string) => {
  const img = await urlToImage(base64);

  const width = img.width;
  const height = img.height;
  // canvas绘制
  canvas.width = width;
  canvas.height = height;
  // 画布清除
  context.clearRect(0, 0, width, height);
  // 绘制图片到canvas
  context.drawImage(img, 0, 0);
  return canvas.toDataURL();
};

export const img2Base64 = async (
  source: InstanceType<typeof Image>
): Promise<string> => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      // canvas绘制
      canvas.width = width;
      canvas.height = height;
      // 画布清除
      context.clearRect(0, 0, width, height);
      // 绘制图片到canvas
      context.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = reject;
    img.src = source.src;
  });
};

export const img2Blob = (img: HTMLImageElement): Promise<Blob> => {
  return new Promise((resolve) => {
    const width = img.width;
    const height = img.height;
    // canvas绘制
    canvas.width = width;
    canvas.height = height;
    // 画布清除
    context.clearRect(0, 0, width, height);
    // 绘制图片到canvas
    context.drawImage(img, 0, 0);

    context.transform;
    canvas.toBlob(resolve as any);
  });
};

const haveDirectionProperties = flatMap(
  ["padding", "margin", "border"].map((item) => [
    `${item}-top`,
    `${item}-right`,
    `${item}-bottom`,
    `${item}-left`,
  ])
);

const validKeys = [
  "color",
  "width",
  "height",
  "position",
  "color",
  "background",
  "background-color",
  "transform",
  "display",
  "font-family",
  "font-size",
  "line-height",
  "flex-direction",
  "align-items",
  "justify-content",
  "text-align",
  "border-radius",
  "box-sizing",
  "opacity",
  "visibility",
  "textTransform",
  ...haveDirectionProperties,
];

function cloneNodeWithInlineStyle(node: ChildNode) {
  const clone = node.cloneNode(true);
  if (!(clone instanceof HTMLElement && node instanceof HTMLElement))
    return clone;

  const style = window.getComputedStyle(node);
  validKeys.forEach((key) => {
    clone.style.setProperty(key, style.getPropertyValue(key));
  });

  clone.childNodes.forEach((child, i) => {
    clone.replaceChild(cloneNodeWithInlineStyle(node.childNodes[i]), child);
  });
  return clone;
}

interface Dom2SvgOptions {
  width?: number;
  height?: number;
  overwrite?: Array<{
    selector: Parameters<Document["querySelector"]>[0] | "";
    style?: React.CSSProperties;
    innerText?: string;
    innerHTML?: string;
    attrs?: Record<string, string>;
  }>;
  styleText?: string;
  wrapper?: (content: Element) => Element;
}
export const dom2Svg = async function (
  dom: HTMLElement,
  option: Dom2SvgOptions = {}
) {
  const width = option.width || dom.offsetWidth;
  const height = option.height || dom.offsetHeight;
  const { overwrite = [], wrapper = (d) => d } = option;

  const cloneDom = cloneNodeWithInlineStyle(dom) as HTMLElement;
  cloneDom.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  cloneDom.classList.remove("outline");

  if (option.styleText) {
    const style = document.createElement("style");
    style.innerHTML = option.styleText;
    cloneDom.appendChild(style);
  }

  overwrite.forEach((item) => {
    if (item.selector === "") {
      if (item instanceof HTMLElement) {
        const style = item.style;
        Object.keys(item.style).forEach((key) => {
          style.setProperty(key, item.style[key as any]);
        });
        if (item.innerText) {
          cloneDom.innerText = item.innerText;
        }
        if (item.innerHTML) {
          cloneDom.innerHTML = item.innerHTML;
        }
        if (item.attrs) {
          Object.keys(item.attrs).forEach((key) => {
            cloneDom.setAttribute(key, item.attrs![key]);
          });
        }
      }
    }

    cloneDom.querySelectorAll(item.selector).forEach((child) => {
      if (get(child, "nodeType") === 1) {
        const node = child as HTMLElement;
        const style = node.style;
        if (item.style) {
          Object.keys(item.style).forEach((key) => {
            style.setProperty(key, (item.style as any)[key]);
          });
        }

        if (item.innerText) {
          node.innerText = item.innerText;
        }
        if (item.innerHTML) {
          node.innerHTML = item.innerHTML;
        }
        if (item.attrs) {
          for (const key in item.attrs) {
            node.setAttribute(key, item.attrs[key]);
          }
        }
      }
    });
  });

  await Promise.all(
    [...cloneDom.querySelectorAll("img")].map(async (item) => {
      item.src = await img2Base64(item);
    })
  );

  const content = new XMLSerializer().serializeToString(wrapper(cloneDom));

  let htmlSvg =
    'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="' +
    width +
    '" height="' +
    height +
    '"><foreignObject x="0" y="0" width="100%" height="100%">' +
    content +
    "</foreignObject></svg>";

  htmlSvg = htmlSvg.replace(/\n/g, "").replace(/\t/g, "").replace(/#/g, "%23");

  return htmlSvg;
};
