import { classnames } from "beacas-editor";
import React from "react";

export function IconFont(props: {
  iconName: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClickCapture?: React.MouseEventHandler<HTMLDivElement>;
  size?: number;
  style?: React.CSSProperties;
  title?: string;
}) {
  return (
    <div
      title={props.title}
      onClick={props.onClick}
      onClickCapture={props.onClickCapture}
      style={{
        pointerEvents: "auto",
        color: "inherit",
        ...(props.style as any),
        fontSize: props.size || props.style?.fontSize,
      }}
      className={classnames("iconfont", props.iconName, props.className)}
    />
  );
}
