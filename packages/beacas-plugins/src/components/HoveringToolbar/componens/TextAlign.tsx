import { NodeUtils, TextElement } from "beacas-core";
import { get } from "lodash";
import React from "react";
import { Editor, Transforms } from "slate";
import { useSlate } from "slate-react";
import { FormatButton } from "./FormatButton";

export const TextAlign = () => {
  const editor = useSlate();
  const [match] = Editor.nodes(editor, {
    match: (n) => NodeUtils.isContentElement(n),
    mode: "all",
  });
  const node = match[0] as TextElement;

  const matchAlign = match && get(node.attributes, "align");

  const onAlignHandle = (align: "left" | "center" | "right") => {
    Transforms.setNodes(
      editor,
      {
        attributes: { ...node.attributes, align },
      },
      {
        at: match[1],
      }
    );
  };

  return (
    <>
      <FormatButton
        active={matchAlign === "left"}
        onClick={() => onAlignHandle("left")}
        icon="icon-align-left"
      />
      <FormatButton
        active={matchAlign === "center"}
        onClick={() => onAlignHandle("center")}
        icon="icon-align-center"
      />
      <FormatButton
        active={matchAlign === "right"}
        onClick={() => onAlignHandle("right")}
        icon="icon-align-right"
      />
    </>
  );
};
