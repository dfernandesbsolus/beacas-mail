import { CustomSlateEditor } from "beacas-editor";
import {
  NodeUtils,
  Element,
  StandardType,
  ElementType,
  BlockManager,
  ElementCategory,
  TextNode,
  ColumnElement,
} from "beacas-core";
import { store } from "@beacas-plugins/store";

import {
  Editor,
  Range,
  Point,
  Element as SlateElement,
  Transforms,
} from "slate";
import { hideCursor } from "@beacas-plugins/utils/hideCursor";
import { sum } from "lodash";

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
    normalizeNode,
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
          if (NodeUtils.isTextElement(block)) {
            const newProperties: Partial<SlateElement> = {
              type: StandardType.STANDARD_PARAGRAPH,
            };
            Transforms.setNodes(editor, newProperties);
          } else {
            const elementDefinition = BlockManager.getBlockByType(
              StandardType.STANDARD_PARAGRAPH
            );
            editor.replaceNode({
              node: elementDefinition.create({
                children: [{ text: "" }],
              }),
              path,
            });
          }

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
    const blockElementEntry = editor.getSelectedBlockElement();
    const blockElement = blockElementEntry?.[0];
    if (blockElement && NodeUtils.isTextElement(blockElement)) {
      insertBreak(...args);
    } else {
      insertNewRow(...args);
    }

    hideCursor(editor);
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (!NodeUtils.isElement(node)) {
      normalizeNode(entry);
      return;
    }

    const block = BlockManager.getBlockByType(node.type);

    if (block.void) {
      normalizeNode(entry);
      return;
    }
    if (node.children.length === 0) {
      const sectionBlock = BlockManager.getBlockByType(
        ElementType.STANDARD_SECTION
      );
      const columnBlock = BlockManager.getBlockByType(
        ElementType.STANDARD_COLUMN
      );
      const textBlock = BlockManager.getBlockByType(
        ElementType.STANDARD_PARAGRAPH
      );

      if (block.category === ElementCategory.PAGE) {
        Transforms.insertNodes(
          editor,
          sectionBlock.create({
            children: [
              columnBlock.create({
                children: [
                  textBlock.create({
                    children: [{ text: "" }],
                  }),
                ],
              }),
            ],
          }),
          {
            at: [0, 0],
          }
        );
      } else if (NodeUtils.isContentElement(node)) {
        Transforms.insertNodes(
          editor,
          { text: "" },
          {
            at: [...path, 0],
          }
        );
      } else {
        Transforms.removeNodes(editor, { at: path });
      }
      return;
    }

    if (node.type === ElementType.MERGETAG) {
      const textChild = node.children[0] as TextNode;
      if (textChild.text === "") {
        Transforms.removeNodes(editor, { at: path });
        return;
      }
    }

    const isSectionElement = block.category.includes(ElementCategory.SECTION);
    const isGroupElement = block.category.includes(ElementCategory.GROUP);

    if (isSectionElement || isGroupElement) {
      const isOnlyOneColumn = node.children.length === 1;

      if (!isOnlyOneColumn) {
        const noWithColumns = node.children.filter(
          (item) => !(item as ColumnElement).attributes.width
        );
        const widthColumns = node.children.filter(
          (item) => (item as ColumnElement).attributes.width
        );

        if (noWithColumns.length > 0) {
          if (
            widthColumns.every((item) =>
              (item as ColumnElement).attributes.width?.includes("%")
            )
          ) {
            const restPerWidth =
              (100 -
                sum(
                  widthColumns.map((item) =>
                    parseFloat((item as ColumnElement).attributes.width!)
                  )
                )) /
              noWithColumns.length;

            node.children.forEach((item, index) => {
              if (NodeUtils.isColumnElement(item) && !item.attributes.width) {
                Transforms.setNodes(
                  editor,
                  {
                    attributes: {
                      width: restPerWidth + "%",
                    },
                  },
                  {
                    at: [...path, index],
                  }
                );
              }
            });
          }
        }
      }
    }

    if (NodeUtils.isElement(node) && node.children.length === 0) {
      Transforms.removeNodes(editor, { at: path });
      return;
    }

    if (NodeUtils.isColumnElement(node) && node.children.length > 1) {
      node.children.forEach((item, index) => {
        if (NodeUtils.isPlaceholderElement(item)) {
          Transforms.removeNodes(editor, {
            at: [...path, index],
          });
        }
      });
    }

    normalizeNode(entry);
  };

  return editor;
};
