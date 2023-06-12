import React, { useMemo, useState } from "react";
const MOBILE_WIDTH = 375;
const MOBILE_Height = 750;

import iphoneFrame from "./iphone.png";
import { Skeleton, Space } from "@arco-design/web-react";
import { IframeComponent } from "beacas-editor";
import { HtmlStringToReactNodes } from "beacas-editor";

export const MobilePreview = ({
  html,
  isActive,
}: {
  html: string;
  isActive: boolean;
}) => {
  const [ref, setRef] = useState<HTMLIFrameElement | null>(null);

  const onLoad: React.DOMAttributes<HTMLIFrameElement>["onLoad"] = (ev) => {
    setRef(ev.target as HTMLIFrameElement);
  };

  return useMemo(() => {
    return (
      <div
        style={{
          height: "100%",
          display: isActive ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
          padding: "10px 0px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            position: "relative",
            margin: "auto",
            padding: "6px 6.8px 2px 6.8px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              position: "absolute",
              padding: "6px 6.8px 2px 6.8px",
              boxSizing: "border-box",
              backgroundImage: `url(${iphoneFrame})`,
              backgroundSize: "100% 100%",
              zIndex: 10,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              width: MOBILE_WIDTH,
              height: MOBILE_Height,
            }}
          >
            <div
              style={{
                height: MOBILE_Height,
                width: MOBILE_WIDTH,
                boxSizing: "content-box",
                borderRadius: 30,
                border: "none",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {!ref && (
                <div style={{ width: 600, margin: "30px auto" }}>
                  <Space
                    direction="vertical"
                    size="large"
                    style={{ width: "100%" }}
                  >
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
              <IframeComponent
                onLoad={onLoad}
                style={{
                  width: "100%",
                  height: "calc(100%)",
                  position: ref ? "relative" : "absolute",
                  opacity: ref ? 1 : 0,
                }}
              >
                <HtmlStringToReactNodes content={html} />
                <style>
                  {`.mjbody {
                        height: 100vh;
                      }
                *::-webkit-scrollbar {
                  -webkit-appearance: none;
                  width: 0px;
                }
                *::-webkit-scrollbar-thumb {
                  background-color: rgba(0, 0, 0, 0.5);
                  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
                  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
                }`}
                </style>
              </IframeComponent>
            </div>
          </div>
        </div>
      </div>
    );
  }, [html, isActive, ref]);
};
