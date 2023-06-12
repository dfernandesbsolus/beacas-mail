import { useSlate } from "slate-react";
import { Node } from "slate";

import { Element } from "beacas-core";
import { useEditorState } from "./useEditorState";

export const useSelectedNode = <T extends Element>() => {
  const editor = useSlate();
  const { selectedNodePath, setLock, lock } = useEditorState();

  const getSelectNode = () => {
    if (!selectedNodePath) return null;
    try {
      return Node.get(editor, selectedNodePath) as Element;
    } catch (error) {
      return null;
    }
  };

  const selectedNode = getSelectNode();

  return {
    selectedNode: selectedNode as T | undefined,
    selectedNodePath: selectedNodePath,
    setLock,
    lock,
  };
};
