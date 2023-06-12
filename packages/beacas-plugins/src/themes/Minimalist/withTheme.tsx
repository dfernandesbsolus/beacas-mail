import { CustomSlateEditor } from "beacas-editor";
import { NodeUtils, Element, StandardType } from "beacas-core";
import { store } from "@beacas-plugins/store";

import {
  Editor,
  Range,
  Point,
  Element as SlateElement,
  Transforms,
} from "slate";
import { hideCursor } from "@beacas-plugins/utils/hideCursor";

export const SHORTCUTS: Record<string, Element["type"]> = {
  "*": StandardType.STANDARD_TEXT_LIST,
  "-": StandardType.STANDARD_TEXT_LIST,
  // ">": "standard-blockquote",
  "#": StandardType.STANDARD_H1,
  "##": StandardType.STANDARD_H2,
  "###": StandardType.STANDARD_H3,
};

export const withTheme = (editor: CustomSlateEditor) => {
  const {
    deleteBackward,
    insertBreak,
    insertNewRow,
    splitColumns,
    insertText,
  } = editor;

  editor.insertText = (text) => {
    Editor.withoutNormalizing(editor, () => {
      const { selection } = editor;

      if (store.ui.blockMenusOverlay.visible) {
        store.ui.setSearch(store.ui.blockMenusOverlay.search + text);
      }

      if (text.endsWith(" ") && selection && Range.isCollapsed(selection)) {
        const { anchor } = selection;
        const block = Editor.above(editor, {
          match: (n) => NodeUtils.isBlockElement(n),
        });
        const path = block ? block[1] : [];
        const start = Editor.start(editor, path);
        const range = { anchor, focus: start };
        const beforeText = Editor.string(editor, range) + text.slice(0, -1);
        const type = SHORTCUTS[beforeText];

        if (type) {
          Transforms.select(editor, range);

          if (!Range.isCollapsed(range)) {
            Transforms.delete(editor);
          }

          const newProperties = {
            type,
          };

          if (type === StandardType.STANDARD_TEXT_LIST) {
            Transforms.delete(editor, { at: path });
            Transforms.insertNodes(editor, {
              type,
              attributes: { "list-style": "number" },
              data: {},
              children: [
                {
                  type: "standard-text-list-item",
                  data: {},
                  attributes: {},
                  children: [
                    {
                      text: "",
                    },
                  ],
                },
              ],
            });
          } else {
            Transforms.setNodes(editor, newProperties as any, {
              match: (n) => NodeUtils.isBlockElement(n),
            });
          }

          return;
        }
      }

      if (
        text.endsWith("/") &&
        selection &&
        Range.isCollapsed(selection) &&
        Editor.isEnd(editor, selection.anchor, selection.anchor.path)
      ) {
        const blockElement = Editor.above(editor, {
          at: selection.anchor.path,
          match: NodeUtils.isBlockElement,
        });

        if (blockElement?.[0]) {
          if (NodeUtils.isTextElement(blockElement[0])) {
            const rect = editor.getSelectionRect();
            if (rect) {
              store.ui.setBlockMenusOverlayVisible(true);
            }
          }
        }
      }
      insertText(text);
    });
  };

  editor.deleteBackward = (unit) => {
    if (store.ui.blockMenusOverlay.visible) {
      if (!store.ui.blockMenusOverlay.search) {
        store.ui.setBlockMenusOverlayVisible(false);
      } else {
        store.ui.blockMenusOverlay.search =
          store.ui.blockMenusOverlay.search.substring(
            0,
            store.ui.blockMenusOverlay.search.length - 1
          );
      }
    }

    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => NodeUtils.isBlockElement(n),
      });

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          SlateElement.isElement(block) &&
          block.type !== StandardType.STANDARD_PARAGRAPH &&
          block.type !== StandardType.STANDARD_TEXT_LIST_ITEM &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: StandardType.STANDARD_PARAGRAPH,
          };
          Transforms.setNodes(editor, newProperties);

          return;
        }
      }
    }

    deleteBackward(unit);
  };

  editor.insertNewRow = (...args) => {
    insertNewRow(...args);
    hideCursor(editor);
  };

  editor.splitColumns = (...args) => {
    splitColumns(...args);
    hideCursor(editor);
  };

  editor.insertBreak = (...args) => {
    insertBreak(...args);
    hideCursor(editor);
  };

  return editor;
};
