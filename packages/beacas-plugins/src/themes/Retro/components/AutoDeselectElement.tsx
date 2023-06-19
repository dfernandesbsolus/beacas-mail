import { NodeUtils } from "beacas-core";
import { useEditorState } from "beacas-editor";
import React, { useEffect } from "react";
import { Editor, Path, Transforms } from "slate";
import { useSlate } from "slate-react";

export const AutoDeselectElement: React.FC = () => {
  const editor = useSlate();

  const { selectedNodePath } = useEditorState();

  useEffect(() => {
    const elementEntry = Editor.above(editor, {
      match: NodeUtils.isElement,
    });

    if (!selectedNodePath) {
      return;
    }

    const isSelfOrParent =
      elementEntry &&
      (Path.equals(elementEntry[1], selectedNodePath) ||
        Path.isParent(selectedNodePath, elementEntry[1]));

    if (!elementEntry || !isSelfOrParent) {
      Transforms.deselect(editor);
    }
  }, [editor, selectedNodePath]);

  return <></>;
};
