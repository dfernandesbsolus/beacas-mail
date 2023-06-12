import { Popover, Tooltip } from "@arco-design/web-react";
import React, { useRef } from "react";
import { Transforms, Text, Editor } from "slate";
import { useSlate } from "slate-react";
import { ColorPickerContent } from "@beacas-plugins/components/Form/ColorPicker/ColorPickerContent";
import { classnames, t, TextNode } from "beacas-core";
import { TextFormat } from "beacas-editor";

export const FontColor = () => {
  const editor = useSlate();
  const [nodeEntry] = Editor.nodes(editor, {
    match: (node) => {
      return Text.isText(node);
    },
    mode: "lowest",
  });
  const ref = useRef<HTMLElement | null>(null);

  const textNode = nodeEntry?.[0] as TextNode | undefined;

  const onClose = () => {
    ref.current?.click();
  };

  const onChange = (val: string) => {
    Transforms.setNodes(
      editor,
      {
        [TextFormat.TEXT_COLOR]: val,
      },
      { match: Text.isText, split: true }
    );
  };
  const color = textNode?.color || "";
  return (
    <Popover
      trigger="click"
      triggerProps={{
        popupStyle: { padding: "10px" },
      }}
      getPopupContainer={(node) => {
        return Array.from(document.querySelectorAll(".RichTextBar")).find(
          (item) => item.contains(node)
        ) as HTMLElement;
      }}
      content={
        <div>
          <ColorPickerContent
            value={color}
            onChange={onChange}
            onClose={onClose}
          />
        </div>
      }
    >
      <Tooltip content={t("Font color")}>
        <span ref={ref} className={classnames("formatButton")}>
          <span
            className={classnames("iconfont")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "16px",
              textAlign: "center",
              fontSize: "16px",
              borderRadius: "2px",
              width: "16px",
              boxSizing: "border-box",
              fontWeight: "500",
              color: color,
              borderColor: color,
              borderWidth: "1px",
              borderStyle: "solid",
              overflow: "hidden",
            }}
          >
            A
          </span>
        </span>
      </Tooltip>
    </Popover>
  );
};
