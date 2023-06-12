import React, { useMemo } from "react";
import { ReactEditor, useSlate } from "slate-react";

import { TextNode } from "beacas-core";
import { TextFormat } from "beacas-editor";
import { Select } from "@arco-design/web-react";
import { Editor, Transforms } from "slate";
import { Text } from "slate";
import { useFontFamily } from "@beacas-plugins/hooks";

export const FontFamily = () => {
  const { fontList } = useFontFamily();
  const editor = useSlate();
  const [nodeEntry] = Editor.nodes(editor, {
    match: (node) => {
      return Text.isText(node);
    },
    mode: "lowest",
  });

  const textNode = nodeEntry?.[0] as TextNode | undefined;

  let fontFamilyValue = textNode?.fontFamily;

  if (!fontFamilyValue && textNode) {
    try {
      const textDomNode = ReactEditor.toDOMNode(editor, textNode);
      fontFamilyValue =
        window.getComputedStyle(textDomNode).fontFamily.split(",")?.[0] || "";
    } catch (error) {}
  }

  const optionsList = useMemo(() => {
    const list = [...fontList];
    if (fontFamilyValue) {
      list.unshift({ label: <>{fontFamilyValue}</>, value: fontFamilyValue });
    }
    return list;
  }, [fontFamilyValue, fontList]);

  const onChange = (val: string) => {
    Transforms.setNodes(
      editor,
      {
        [TextFormat.FONT_FAMILY]: val,
      },
      { match: Text.isText, split: true }
    );
  };

  return (
    <>
      <Select
        className="Beacas-font-family"
        value={fontFamilyValue}
        style={{ minWidth: 80 }}
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
      <style>{`.Beacas-font-family .arco-select-view { border: none; }`}</style>
    </>
  );
};
