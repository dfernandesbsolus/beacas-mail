import React from "react";

import "./index.scss";

export interface AttributesPanelWrapper {
  style?: React.CSSProperties;
  extra?: React.ReactNode;
  children?: React.ReactNode;
}
export const AttributesPanelWrapper: React.FC<AttributesPanelWrapper> = (
  props
) => {
  return (
    <div className="AttributesPanelWrapper">
      <div style={{ padding: "20px 0px", ...props.style }}>
        {props.children}
      </div>
    </div>
  );
};
