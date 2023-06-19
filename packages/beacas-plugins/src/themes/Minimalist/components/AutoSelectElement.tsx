import { NodeUtils } from "beacas-core";
import { useEditorState } from "beacas-editor";
import React, { useEffect } from "react";
import { Editor, Node, Path, Transforms } from "slate";
import { useSlate } from "slate-react";

export const AutoSelectElement: React.FC = () => {
  const editor = useSlate();

  const nodeEntry = editor.getSelectedBlockElement();
  const { setSelectedNodePath, selectedNodePath } = useEditorState();

  const selectionPath = editor.selection?.anchor.path;
  const isUnsetElement = Editor.above(editor, {
    at: selectionPath,
    match: NodeUtils.isUnsetElement,
  });

  useEffect(() => {
    if (isUnsetElement) {
      Transforms.deselect(editor);
    }
  }, [editor, isUnsetElement]);

  useEffect(() => {
    let path = nodeEntry?.[1];
    if (!path) {
      return;
    }
    const element = Node.get(editor, path);
    if (NodeUtils.isTextListItemElement(element)) {
      path = path.slice(0, path.length - 1);
    }

    const isSelfOrParent =
      selectedNodePath &&
      (Path.equals(path, selectedNodePath) ||
        Path.isAncestor(selectedNodePath, path));

    if (isSelfOrParent) {
      return;
    }

    const voidBlockElementEntry = Editor.above(editor, {
      at: path,
      match: (node) =>
        NodeUtils.isBlockElement(node) && NodeUtils.isVoidBlockElement(node),
    });
    if (voidBlockElementEntry) {
      setSelectedNodePath(voidBlockElementEntry[1]);
    } else {
      setSelectedNodePath(path);
    }
  }, [editor, nodeEntry, selectedNodePath, setSelectedNodePath]);

  return <></>;
};
