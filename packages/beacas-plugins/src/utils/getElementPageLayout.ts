import { CustomSlateEditor } from "beacas-editor";
import { ReactEditor } from "slate-react";

export const getElementPageLayout = (params: {
  editor: CustomSlateEditor;
  overlayElement: HTMLElement;
  relativedElement: HTMLElement | Range;
}) => {
  const contentWindow = ReactEditor.getWindow(params.editor);
  const iframe = [...document.querySelectorAll("iframe")].find(
    (item) => item.contentWindow === contentWindow
  );
  if (!iframe) return;

  const relativedElementReact = params.relativedElement.getBoundingClientRect();
  const overlayRect = params.overlayElement.getBoundingClientRect();
  const iframeRect = iframe.getBoundingClientRect();

  const top =
    overlayRect.height +
    relativedElementReact.height +
    relativedElementReact.top;

  const edge = 20;

  const isBottomEnough = document.documentElement.clientHeight > top + edge;
  const isTopEnough =
    iframeRect.top + relativedElementReact.top - overlayRect.height > edge;

  return {
    pageXOffset: iframeRect.left + relativedElementReact.left,
    pageYOffset: iframeRect.top + relativedElementReact.top,
    isBottomEnough,
    isTopEnough,
    iframeRect,
    relativedElementReact,
    overlayRect,
  };
};
