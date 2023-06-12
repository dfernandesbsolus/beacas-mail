import React, { useEffect, useMemo, useState } from "react";
import { Skeleton, Space } from "@arco-design/web-react";
import { IframeComponent } from "beacas-editor";
import { HtmlStringToReactNodes } from "beacas-editor";

export const DesktopEmailPreview = ({
  html,
  isActive,
}: {
  html: string;
  isActive: boolean;
}) => {
  const [ref, setRef] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (ref && ref.contentWindow) {
      ref.contentWindow?.postMessage({ type: "email-render", html }, "*");
    }
  }, [html, ref, ref?.contentWindow]);

  const onLoad: React.DOMAttributes<HTMLIFrameElement>["onLoad"] = (ev) => {
    setRef(ev.target as HTMLIFrameElement);
  };

  return useMemo(() => {
    return (
      <>
        <IframeComponent
          style={{
            width: "100%",
            height: "calc(100%)",
            position: ref ? "relative" : "absolute",
            opacity: ref ? 1 : 0,
            display: isActive ? "flex" : "none",
          }}
          onLoad={onLoad}
        >
          <HtmlStringToReactNodes content={html} />
        </IframeComponent>
        {!ref && (
          <div style={{ width: 600, margin: "30px auto" }}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Skeleton
                animation
                image={{
                  size: "large",
                }}
                text={{
                  rows: 3,
                }}
              />
              <Skeleton
                animation
                text={{
                  rows: 3,
                }}
              />
              <Skeleton
                animation
                text={{
                  rows: 4,
                }}
              />

              <Skeleton
                animation
                text={{
                  rows: 5,
                }}
              />
            </Space>
          </div>
        )}
      </>
    );
  }, [html, isActive, ref]);
};
