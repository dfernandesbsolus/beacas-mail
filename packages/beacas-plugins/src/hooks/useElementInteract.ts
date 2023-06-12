import { BlockManager, ElementType, PageElement } from "beacas-core";
import { useEditorState } from "beacas-editor";
import { cloneDeep, omit } from "lodash";
import { useCallback } from "react";
import { Editor, Node, Path, Transforms } from "slate";
import { useSlate } from "slate-react";

export const useElementInteract = () => {
  const editor = useSlate();
  const { setSelectedNodePath, setHoverNodePath } = useEditorState();

  const copyBlock = useCallback(
    (path: Path) => {
      const block = Node.get(editor, path);

      const next = Path.next(path);

      Transforms.insertNodes(editor, cloneDeep(block), {
        at: next,
      });
      try {
        // Transforms.select(editor, Editor.end(editor, ));
        setSelectedNodePath(next);
      } catch (error) {}
    },
    [editor, setSelectedNodePath]
  );

  const deleteBlock = useCallback(
    (path: Path) => {
      const [entry] = Editor.nodes(editor, {
        match(node, currentPath) {
          return Path.equals(path, currentPath);
        },
      });
      if (entry) {
        setSelectedNodePath(null);

        setTimeout(() => {
          Transforms.delete(editor, {
            at: path,
          });
        }, 0);
      } else {
        Transforms.delete(editor, {
          at: path,
        });
      }
      setHoverNodePath(null);
    },
    [editor, setHoverNodePath, setSelectedNodePath]
  );

  const clearCanvas = useCallback(() => {
    Editor.withoutNormalizing(editor, () => {
      const pageElement = editor.children[0] as PageElement;

      const newPageElement = BlockManager.getBlockByType(
        ElementType.PAGE
      ).create();

      pageElement.children.forEach((_, index) => {
        Transforms.removeNodes(editor, {
          at: [0, pageElement.children.length - index - 1],
        });
      });

      Transforms.setNodes(
        editor,
        {
          ...omit(newPageElement, ["children"]),
        },
        {
          at: [0],
        }
      );
    });
    setSelectedNodePath(null);
    Transforms.deselect(editor);
  }, [editor, setSelectedNodePath]);

  return {
    copyBlock,
    deleteBlock,
    clearCanvas,
  };
};
