import React, { useMemo } from "react";
import { ReactEditor, useSlate } from "slate-react";

import { TextNode } from "beacas-core";
import { TextFormat, useEditorProps } from "beacas-editor";
import { Select } from "@arco-design/web-react";
import { Editor, Transforms } from "slate";
import { Text } from "slate";

const options = ["12px", "14px", "16px", "18px", "24px", "32px", "48px"];

export const FontSize = () => {
  const { fontSizeList } = useEditorProps();

  const editor = useSlate();
  const [nodeEntry] = Editor.nodes(editor, {
    match: (node) => {
      return Text.isText(node);
    },
    mode: "lowest",
  });

  const textNode = nodeEntry?.[0] as TextNode | undefined;

  let fontSizeValue = textNode?.fontSize;

  if (!fontSizeValue && textNode) {
    try {
      const textDomNode = ReactEditor.toDOMNode(editor, textNode);
      fontSizeValue = window.getComputedStyle(textDomNode).fontSize;
    } catch (error) {}
  }

  const optionsList = useMemo(() => {
    const list = [...(fontSizeList || options)];
    if (fontSizeValue) {
      list.push(fontSizeValue);
    }
    return [...new Set(list)]
      .sort()
      .map((item) => ({ label: item, value: item }));
  }, [fontSizeList, fontSizeValue]);

  const onChange = (val: string) => {
    Transforms.setNodes(
      editor,
      {
        [TextFormat.FONT_SIZE]: val,
      },
      { match: Text.isText, split: true }
    );
  };

  return (
    <>
      <Select
        className="Beacas-font-size"
        value={fontSizeValue}
        style={{ width: 80 }}
        onChange={onChange}
        triggerProps={{
          autoAlignPopupWidth: false,
          autoAlignPopupMinWidth: true,
        }}
      >
        {optionsList.map((option, index) => {
          return (
            <Select.Option key={index} value={option.value}>
              {option.label}
            </Select.Option>
          );
        })}
      </Select>
      <style>{`.Beacas-font-size .arco-select-view { border: none; }`}</style>
    </>
  );
};
