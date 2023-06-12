import { BlockManager, ElementType, NodeUtils } from "beacas-core";
import { CustomSlateEditor } from "beacas-editor";
import { Editor, Transforms } from "slate";

export const withTheme = (editor: CustomSlateEditor) => {
  const { insertBreak, normalizeNode, deleteBackward } = editor;

  editor.insertBreak = (...args) => {
    const node = Editor.above(editor, {
      match: NodeUtils.isTextElement,
    });
    if (!node) return;

    insertBreak(...args);
  };

  editor.deleteBackward = (unit) => {
    const contentElementEntry = Editor.above(editor, {
      match: NodeUtils.isContentElement,
    });

    if (contentElementEntry) {
      const isVoid = NodeUtils.isVoidBlockElement(contentElementEntry[0]);
      const textElement = contentElementEntry[0];
      if (textElement.children.length === 1 && !isVoid) {
        const child = textElement.children[0];
        if (NodeUtils.isTextNode(child) && child.text === "") {
          return;
        }
      }
    }

    deleteBackward(unit);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (NodeUtils.isColumnElement(node)) {
      if (node.children.length === 0) {
        const placeholderBlock = BlockManager.getBlockByType(
          ElementType.PLACEHOLDER
        );

        Transforms.insertNodes(editor, placeholderBlock.create(), {
          at: [...path, 0],
        });
        return;
      }
    }
    normalizeNode(entry);
  };

  return editor;
};
