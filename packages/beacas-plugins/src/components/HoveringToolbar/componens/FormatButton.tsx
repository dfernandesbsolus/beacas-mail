import React from "react";
import { useSlate } from "slate-react";

import { classnames } from "beacas-core";
import { isFormatActive, TextFormat, toggleFormat } from "beacas-editor";
import { Tooltip } from "@arco-design/web-react";

export const FormatButton = ({
  format,
  icon,
  onClick: onClickHandle,
  title,
  ...rest
}: {
  format?: TextFormat;
  icon: string;
  onClick?: () => void;
  active?: boolean;
  title?: string;
}) => {
  const editor = useSlate();
  const active = rest.active || (format && isFormatActive(editor, format));

  const onClick = () => {
    if (onClickHandle) {
      onClickHandle();
      return;
    }
    if (!format) return;
    toggleFormat(editor, format);
  };

  return (
    <Tooltip content={title}>
      <span
        className={classnames(
          "formatButton iconfont ",
          icon,
          active && "format-active"
        )}
        onClick={onClick}
      />
    </Tooltip>
  );
};
