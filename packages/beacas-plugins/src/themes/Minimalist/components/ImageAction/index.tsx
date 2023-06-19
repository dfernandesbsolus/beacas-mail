import { Button, Input, Space, Tabs } from "@arco-design/web-react";
import { Uploader } from "@beacas-plugins/utils/Uploader";
import { getElementPageLayout } from "@beacas-plugins/utils/getElementPageLayout";
import { ImageElement, t } from "beacas-core";
import { useEditorProps } from "beacas-editor";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import "./index.scss";
import { MoreIcon } from "./MoreIcon";

export const ImageAction: React.FC<{
  element: ImageElement;
  isHover: boolean;
}> = (props) => {
  const element = props.element;
  const editor = useSlate();
  const [isLoading, setIsUploading] = useState(false);
  const [inputImage, setInputImage] = useState(element.attributes.src || "");
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contextProps = useEditorProps();

  useEffect(() => {
    if (!visible) return;

    const onKeydown = (ev: KeyboardEvent) => {
      if (ev.code === "Escape") {
        setVisible(false);
      }
    };

    const onBlur = (ev: PointerEvent) => {
      if (
        overlayRef.current?.contains(ev.target as any) ||
        placeholderRef.current?.contains(ev.target as any)
      ) {
        return;
      }
      setVisible(false);
    };

    const root = ReactEditor.getWindow(editor);
    root.addEventListener("pointerdown", onBlur);
    window.addEventListener("pointerdown", onBlur);
    root.addEventListener("keydown", onKeydown);
    return () => {
      root.removeEventListener("pointerdown", onBlur);
      window.removeEventListener("pointerdown", onBlur);
      root.removeEventListener("keydown", onKeydown);
    };
  }, [editor, visible]);

  const onUpload = () => {
    if (!contextProps.onUpload) return;
    const uploader = new Uploader(contextProps.onUpload, {
      limit: 1,
      accept: "image/*",
    });

    uploader.on("start", (photos) => {
      setIsUploading(true);

      uploader.on("end", (data) => {
        const url = data[0]?.url;
        if (url) {
          setVisible(false);
          Transforms.setNodes(
            editor,
            {
              attributes: { ...element.attributes, src: url },
            },
            {
              at: ReactEditor.findPath(editor, element),
            }
          );
        }
        setIsUploading(false);
      });
    });

    uploader.chooseFile();
  };

  const onEmbedImage = () => {
    setVisible(false);
    Transforms.setNodes(
      editor,
      {
        attributes: { ...element.attributes, src: inputImage },
      },
      {
        at: ReactEditor.findPath(editor, element),
      }
    );
  };
  useEffect(() => {
    console.log("uuu");
  }, []);

  const onToggle = () => {
    if (!placeholderRef.current || !overlayRef.current) return;
    if (visible) {
      setVisible(false);
      return;
    }
    const domNode = placeholderRef.current;
    const overlayNode = overlayRef.current;

    const layout = getElementPageLayout({
      editor,
      overlayElement: overlayNode,
      relativedElement: domNode,
      overlayElementHeight: 160,
    });

    if (!layout) return;

    if (layout.isBottomEnough) {
      setPosition({
        left: layout.pageXOffset,
        top: layout.pageYOffset + layout.relativedElementReact.height,
      });
    } else {
      setPosition({
        left: layout.pageXOffset,
        top: layout.pageYOffset - layout.overlayRectHeight,
      });
    }

    setVisible(true);
  };

  const noSrc = !element.attributes.src;

  const popoverContent = (
    <>
      {createPortal(
        <div
          ref={overlayRef}
          className="beacas-overlay"
          style={{
            width: 500,
            minHeight: 125,
            display: visible ? undefined : "none",
            left: position.left,
            top: position.top,
          }}
        >
          <Tabs className="beacas-image-action-Popover-tabs">
            <Tabs.TabPane title={<div>{t("Upload")}</div>} key="Upload">
              <div style={{ padding: 15 }}>
                <Button
                  style={{ width: "100%" }}
                  type="outline"
                  onClick={onUpload}
                  loading={isLoading}
                >
                  {t(`Upload image`)}
                </Button>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane title="Embed link" key="Embed link">
              <div style={{ padding: 15 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Input
                    placeholder="Paste the image link…"
                    value={inputImage}
                    onChange={setInputImage}
                  />
                  <Button type="primary" onClick={onEmbedImage}>
                    {t(`Embed image`)}
                  </Button>
                </Space>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>,
        document.body
      )}
      <div
        ref={placeholderRef}
        onPointerDown={onToggle}
        contentEditable={false}
        className="beacas-image-action"
        style={{
          padding: noSrc ? "12px 36px 12px 12px" : undefined,
          display: "flex",
          alignItems: "center",
          textAlign: "left",
          width: noSrc ? "100%" : 0,
          height: noSrc ? undefined : 0,
          overflow: "hidden",
          backgroundColor: "rgb(242, 241, 238)",
          transition: "background 100ms ease-in",
          boxSizing: "border-box",
          cursor: "pointer",
          position: noSrc ? "relative" : "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      >
        <svg
          viewBox="0 0 30 30"
          style={{
            width: "25px",
            height: "25px",
            display: "block",
            fill: "rgba(55, 53, 47, 0.45)",
            flexShrink: "0",
            backfaceVisibility: "hidden",
            marginRight: "12px",
          }}
        >
          <path d="M1,4v22h28V4H1z M27,24H3V6h24V24z M18,10l-5,6l-2-2l-6,8h20L18,10z M11.216,17.045l1.918,1.918l4.576-5.491L21.518,20H9 L11.216,17.045z M7,12c1.104,0,2-0.896,2-2S8.104,8,7,8s-2,0.896-2,2S5.896,12,7,12z" />
        </svg>
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "rgba(55, 53, 47, 0.65)",
            fontSize: 14,
            lineHeight: "14px",
          }}
        >
          {t(`Add an image`)}
        </div>
      </div>

      <style>{`

      .beacas-image-action:hover {
        background-color: #e3e2df !important;
      }`}</style>

      <MoreIcon isHover={props.isHover} onToggleImageActionVisible={onToggle} />
    </>
  );

  return <>{popoverContent}</>;
};
