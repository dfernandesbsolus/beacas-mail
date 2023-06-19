import React, { useEffect, useState } from "react";
import {
  ReactEditor,
  RenderLeafProps,
  useSelected,
  useSlateStatic,
} from "slate-react";

import { classnames } from "@beacas-editor/utils/classnames";
import { t } from "beacas-core";

export const Leaf = (
  props: Partial<RenderLeafProps> &
    Pick<RenderLeafProps, "text"> & {
      contentUneditable?: boolean;
    }
) => {
  const [isCompositionstart, setIsCompositionstart] = useState(false);
  const selected = useSelected();
  const editor = useSlateStatic();
  const isEmpty = props.text?.text.length === 0;

  const classNames = classnames(
    selected && isEmpty && !isCompositionstart ? "text-empty" : "",
    props.contentUneditable && "text-uneditable"
  );

  useEffect(() => {
    if (!selected) return;
    const root = ReactEditor.findDocumentOrShadowRoot(editor);
    const compositionStart = () => {
      setIsCompositionstart(true);
    };
    const compositionEnd = () => {
      setIsCompositionstart(false);
    };

    root.addEventListener("compositionstart", compositionStart);
    root.addEventListener("compositionend", compositionEnd);
    return () => {
      root.removeEventListener("compositionstart", compositionStart);
      root.removeEventListener("compositionend", compositionEnd);
    };
  }, [editor, selected]);

  const leaf = props.text;
  let children = props.children;
  const style: React.CSSProperties = { whiteSpace: "pre-wrap" };

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>;
  }

  if (leaf.link) {
    children = (
      <a href={leaf.link.href} target={leaf.link.blank ? "_blank" : undefined}>
        {children}
      </a>
    );
  }

  if (leaf.color) {
    style.color = leaf.color;
  }

  if (leaf.bgColor) {
    style.backgroundColor = leaf.bgColor;
  }

  if (leaf.fontSize) {
    style.fontSize = leaf.fontSize;
  }

  if (leaf.fontFamily) {
    style.fontFamily = leaf.fontFamily;
  }

  return (
    <span
      contentEditable={props.contentUneditable ? false : undefined}
      placeholder={t("Type '/' for commands")}
      {...props.attributes}
      style={style}
      className={classNames}
    >
      {children}
    </span>
  );
};
