import React from "react";
import "overlayscrollbars/css/OverlayScrollbars.css";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { get } from "lodash";

export const FullHeightOverlayScrollbars: React.FC<
  | {
      height: string | number;
      children: React.ReactNode;
    }
  | {
      maxHeight: string | number;
      children: React.ReactNode;
    }
> = (props) => {
  const Com = OverlayScrollbarsComponent;
  return (
    <Com
      options={{ scrollbars: { autoHide: "scroll" } }}
      style={{
        maxHeight: get(props, "maxHeight"),
        height: get(props, "height"),
      }}
    >
      {props.children}
    </Com>
  );
};
