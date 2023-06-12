import React, { useState } from "react";
import { createPortal } from "react-dom";

interface Props
  extends React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > {
  children: React.ReactNode;
  title?: string;
  windowRef?: (e: Window) => void;
  onLoad?: (evt: React.SyntheticEvent<HTMLIFrameElement, Event>) => void;
}

export const IframeComponent = ({
  children,
  title,
  windowRef,
  ...props
}: Props) => {
  const [mountNode, setMountNode] = useState(null);

  const onLoad: React.ReactEventHandler<HTMLIFrameElement> = (evt) => {
    const contentWindow = (evt.target as any)?.contentWindow;
    if (!contentWindow) return;
    windowRef?.(contentWindow);
    const innerBody = contentWindow.document.body;
    setMountNode(innerBody);
    props.onLoad?.(evt);
  };

  return (
    <iframe
      frameBorder={0}
      title={title}
      srcDoc={
        '<!doctype html> <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head></head> <body> </body> </html>'
      }
      {...(props as any)}
      onLoad={onLoad}
    >
      {mountNode && createPortal(children, mountNode)}
      <style>{"body {margin:0}"}</style>
    </iframe>
  );
};
