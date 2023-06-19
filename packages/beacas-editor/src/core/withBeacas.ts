import { CustomSlateEditor } from "@beacas-editor/typings/custom-types";
import { ReactEditor } from "slate-react";
import {
  Editor,
  Text,
  Node,
  Path,
  Transforms,
  NodeEntry,
  Range,
  Ancestor,
} from "slate";

import { isEqual, sum } from "lodash";
import {
  NodeUtils,
  ColumnElement,
  Element,
  StandardType,
  StandardParagraphElement,
  BlockManager,
  ElementCategory,
  ElementType,
  TextNode,
  mergeBlock,
} from "beacas-core";
import { EmailEditorProps } from "..";

let historyShouldMerge = false;

let historyShouldMergeTimer: NodeJS.Timeout;
const historyShouldMergeTimerStart = () => {
  clearTimeout(historyShouldMergeTimer);
  historyShouldMergeTimer = setTimeout(() => {
    historyShouldMerge = false;
  }, 1000);
};

export const withBeacas = (
  editor: CustomSlateEditor,
  props: EmailEditorProps
) => {
  const {
    deleteBackward,
    deleteForward,
    insertBreak,
    normalizeNode,
    isVoid,
    apply,
    isInline,
    insertText,
  } = editor;

  editor.isInline = (element) => {
    const ele = BlockManager.getBlockByType(element.type);
    if (ele) {
      return !!ele.inlineElement;
    }
    return isInline(element);
  };

  editor.isVoid = (element) => {
    const ele = BlockManager.getBlockByType(element.type);

    const isVoidBlocksCategory = [ElementCategory.IMAGE].some((item) =>
      ele.category.includes(item)
    );
    const isVoidBlocksType = [
      ElementType.LINE_BREAK as Element["type"],
    ].includes(element.type);

    return isVoidBlocksCategory || isVoidBlocksType ? true : isVoid(element);
  };

  editor.getSelectionRect = () => {
    const domSelection = ReactEditor.getWindow(editor).getSelection();
    if (!domSelection) return null;
    try {
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();
      return rect;
    } catch (error) {}

    return null;
  };

  editor.getSelectedBlockElement = () => {
    const [nodeEntry] = Editor.nodes(editor, {
      at: editor.selection?.anchor.path,
      match: NodeUtils.isBlockElement,
      mode: "lowest",
    });

    return nodeEntry;
  };

  editor.insertText = (text) => {
    insertText(text);
  };

  editor.deleteBackward = (unit) => {
    deleteBackward(unit);
  };

  editor.deleteForward = (unit) => {
    deleteForward(unit);
  };

  editor.insertNewLine = (options) => {
    let element: Element | null = null;
    if (options?.path) {
      element = Node.get(editor, options.path) as Element;
    }

    if (!element) {
      const elementEntry = Editor.above(editor, {
        match(node, path) {
          return NodeUtils.isElement(node);
        },
        mode: "lowest",
        at: options?.path,
      });
      element = elementEntry?.[0] as Element;
    }

    if (!element) return;

    if (NodeUtils.isContentElement(element)) {
      Transforms.insertNodes(
        editor,
        {
          type: StandardType.STANDARD_PARAGRAPH,
          attributes: {},
          data: {},
          children: [{ text: "" }],
        },
        { at: options?.path }
      );
      if (options?.path) {
        Transforms.select(editor, Editor.end(editor, options.path));
        const at = Editor.end(editor, options.path);
        Transforms.setSelection(editor, { anchor: at, focus: at });
      }
    }
  };

  editor.insertNewRow = (options) => {
    const elementEntry = Editor.above(editor, {
      match(node, path) {
        return NodeUtils.isElement(node);
      },
      mode: "lowest",
      at: options?.path,
    });

    const element = elementEntry?.[0] as Element;
    if (!element) return;

    let insertPath = options?.path;
    if (!insertPath) {
      const rowBlockEntry = Editor.above(editor, {
        match(node) {
          return (
            NodeUtils.isBlockElement(node) && NodeUtils.isSectionElement(node)
          );
        },
      });
      if (rowBlockEntry) {
        insertPath = rowBlockEntry[1];
      }
    }

    if (insertPath) {
      insertPath = Path.next(insertPath);
      apply({
        type: "insert_node",
        path: insertPath,
        node: {
          type: StandardType.STANDARD_SECTION,
          attributes: {},
          data: {},
          children: [
            {
              type: StandardType.STANDARD_COLUMN,
              attributes: {},
              data: {},
              children: [
                {
                  type: StandardType.STANDARD_PARAGRAPH,
                  attributes: {},
                  data: {},
                  children: [{ text: "" }],
                },
              ],
            },
          ],
        },
      });
      const newSelection = Editor.end(editor, insertPath);

      setTimeout(() => {
        Transforms.select(editor, newSelection);
      }, 200);
    }
  };

  editor.insertBreak = () => {
    // if (editor.selection) {
    //   editor.insertNewLine();
    // }

    if (props.newLineWithBr) {
      const elementEntry = Editor.above(editor, {
        match(node, path) {
          return NodeUtils.isElement(node);
        },
        mode: "lowest",
      });

      const node = elementEntry?.[0] as Element;

      if (node) {
        if (NodeUtils.isTextElement(node)) {
          Transforms.insertNodes(editor, {
            type: ElementType.LINE_BREAK,
            children: [{ text: "" }],
            data: {},
            attributes: {},
          });
          return;
        }
      }
    }

    insertBreak();
  };

  editor.splitColumns = (options) => {
    const [columnNodeEntry] = Editor.nodes(editor, {
      at: options.path,
      match: NodeUtils.isColumnElement,
    });

    const columnNode = columnNodeEntry[0];

    if (!NodeUtils.isElement(columnNode)) return;

    const sectionNode = Editor.parent(editor, columnNodeEntry[1])[0];
    const nonRawChildren = sectionNode.children.filter(
      (item) => NodeUtils.isElement(item) && item.type !== "raw"
    );

    if (nonRawChildren.length >= 2) {
      const endChild = Editor.end(
        editor,
        ReactEditor.findPath(editor, nonRawChildren[nonRawChildren.length - 1])
      );
      Transforms.setSelection(editor, {
        anchor: endChild,
        focus: endChild,
      });
      return;
    }

    const point = Editor.end(editor, options.path);

    Transforms.setSelection(editor, {
      anchor: point,
      focus: point,
    });
    Transforms.splitNodes(editor, {
      at: Editor.end(editor, options.path),
      match: NodeUtils.isSectionElement,
    });

    const prevPath = Editor.before(editor, options.path);

    if (prevPath) {
      Transforms.splitNodes(editor, {
        at: Editor.end(editor, prevPath),
        match: NodeUtils.isSectionElement,
      });
    }
    const percent = `${(nonRawChildren.length / 2) * 100}%`;
    Transforms.setNodes<ColumnElement>(
      editor,
      {
        attributes: { ...columnNode.attributes, width: percent },
      },
      {
        match: NodeUtils.isColumnElement,
      }
    );

    Transforms.insertNodes(
      editor,
      {
        type: StandardType.STANDARD_COLUMN,
        data: {},
        attributes: { ...columnNode.attributes, width: percent },
        children: [
          {
            type: StandardType.STANDARD_PARAGRAPH,
            attributes: {},
            children: [{ text: "" }],
          } as StandardParagraphElement,
        ],
      },
      {
        match: NodeUtils.isColumnElement,
      }
    );
  };

  editor.moveNode = (options) => {
    Editor.withoutNormalizing(editor, () => {
      apply({
        type: "move_node",
        path: options.at,
        newPath: options.to,
      });
    });
  };

  editor.insertData = (data) => {
    Editor.withoutNormalizing(editor, () => {
      const fragment = data.getData(`application/x-slate-fragment`);

      if (fragment) {
        const decoded = decodeURIComponent(window.atob(fragment));
        const parsed = JSON.parse(decoded) as Node[];

        const nodes = Node.nodes(parsed[0]);

        const texNodes = [...nodes]
          .map((item) => item[0])
          .filter((item) => NodeUtils.isContentElement(item));

        editor.insertFragment(texNodes);
      } else {
        const textList = data.getData(`text`).split("\n");

        const nodes: Node[] = [];
        textList.forEach((text, index) => {
          nodes.push({ text });
          if (index !== textList.length - 1) {
            nodes.push({
              type: ElementType.LINE_BREAK,
              data: {},
              attributes: {},
              children: [{ text: "" }],
            });
          }
        });

        Transforms.insertNodes(editor, nodes, {
          match: Text.isText,
        });
      }
    });
  };

  editor.insertMergetag = (options) => {
    Editor.withoutNormalizing(editor, () => {
      const [match] = Editor.nodes(editor, {
        match: (n) =>
          NodeUtils.isInlineElement(n) && n.type === ElementType.MERGETAG,
        mode: "all",
      });
      if (!match) {
        Transforms.insertNodes(
          editor,
          [
            {
              type: ElementType.MERGETAG,
              data: {},
              attributes: {},
              children: [{ text: options.mergetag }],
            },
            {
              text: " ",
            },
          ],
          { match: Text.isText, at: options.path }
        );
      }
    });
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

      if (block.category === ElementCategory.PAGE) {
        Transforms.insertNodes(
          editor,
          sectionBlock.create({
            children: [columnBlock.create({})],
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

  editor.replaceNode = (options) => {
    Editor.withoutNormalizing(editor, () => {
      const targetPath = options.path;
      const node = Node.get(editor, targetPath);

      apply({
        type: "insert_node",
        path: Path.next(targetPath),
        node: options.node as Element,
      });
      apply({
        type: "remove_node",
        path: targetPath,
        node: node,
      });
      const at = Editor.end(editor, targetPath);
      const isUnsetElement = Editor.above(editor, {
        at,
        match: NodeUtils.isUnsetElement,
      });

      if (isUnsetElement) {
        Transforms.deselect(editor);
      } else {
        Transforms.setSelection(editor, { anchor: at, focus: at });
      }
    });
  };

  editor.removeNode = (options) => {
    let removePath = options?.path || editor.selection?.anchor.path;

    let parnetEntry = Editor.above(editor, { at: removePath });
    if (!parnetEntry) return;
    while (parnetEntry[0].children.length <= 1) {
      removePath = parnetEntry[1];
      const above = Editor.above(editor, { at: removePath }) as
        | NodeEntry<Ancestor>
        | undefined;
      if (above) {
        parnetEntry = above;
      }
    }

    if (removePath) {
      apply({
        type: "remove_node",
        path: removePath,
        node: Node.get(editor, removePath),
      });
    }
  };

  // 当 should merge 存在的时候，才可以合并历史，否则不合并
  // 每一秒相同的操作，只记录一次
  // set_node 的时候设置 should merge，然后一秒后设置为 false
  editor.writeHistory = (stack: "undos" | "redos", batch: any) => {
    if (stack === "undos") {
      const currentShouldMerge = historyShouldMerge;
      if (batch?.operations?.[0].type === "set_node") {
        historyShouldMerge = true;
        historyShouldMergeTimerStart();
      }
      if (currentShouldMerge) {
        const lastRecord = editor.history[stack].slice(-1)[0] as any;
        const lastRecordPath = lastRecord?.operations?.[0]?.path;
        if (
          batch?.operations?.[0].type === "set_node" &&
          lastRecord?.operations?.[0].type === "set_node" &&
          batch?.operations.length === 1
        ) {
          const currentPath = batch?.operations?.[0]?.path;
          if (Path.equals(lastRecordPath, currentPath)) {
            editor.history[stack].pop();
          }
          const properties = lastRecord?.operations?.[0]?.properties;
          const newProperties = mergeBlock(
            lastRecord?.operations?.[0]?.newProperties,
            batch?.operations?.[0]?.newProperties
          );
          editor.history[stack].push({
            ...batch,
            operations: [
              {
                ...batch?.operations?.[0],
                properties,
                newProperties,
              },
            ],
          });

          return;
        }
      }
    }
    editor.history[stack].push(batch);
  };

  editor.apply = (operation) => {
    if (operation.type === "set_node") {
      if (isEqual(operation.newProperties, operation.properties)) return;
    }

    if (operation.type === "remove_text") {
      const [mergetagNodeEntry] = Editor.nodes(editor, {
        match: (n) => NodeUtils.isElement(n) && n.type === ElementType.MERGETAG,
        at: operation.path,
      });

      if (mergetagNodeEntry) {
        Transforms.removeNodes(editor, { at: mergetagNodeEntry[1] });
        return;
      }
    }

    // TODO 不记得这里为什么要这么写
    if (operation.type === "remove_node" || operation.type === "merge_node") {
      const nodeEntry = Editor.above(editor, {
        at: operation.path,
        match: NodeUtils.isBlockElement,
      });
      if (nodeEntry && NodeUtils.isVoidBlockElement(nodeEntry[0])) {
        return;
      }
    }

    if (operation.type === "set_selection") {
      try {
        if (
          operation.newProperties &&
          Range.isRange(operation.newProperties) &&
          Range.isCollapsed(operation.newProperties) &&
          !Editor.isEnd(
            editor,
            operation.newProperties?.anchor,
            operation.newProperties?.anchor?.path
          )
        ) {
          const elementEntry = Editor.above(editor, {
            match: (n) => NodeUtils.isBlockElement(n),
            at: operation.newProperties.anchor.path,
            mode: "lowest",
          });

          if (elementEntry) {
            const element = elementEntry[0];
            const mergetagIndex = element.children.findIndex(
              (child) =>
                NodeUtils.isElement(child) &&
                child.type === ElementType.MERGETAG
            );

            const lastChild = element.children[element.children.length - 1];

            if (
              mergetagIndex === element.children.length - 2 &&
              NodeUtils.isTextNode(lastChild) &&
              lastChild.text === ""
            ) {
              Transforms.insertNodes(
                editor,
                { text: " " },
                {
                  at: Path.next([
                    ...elementEntry[1],
                    element.children.length - 1,
                  ]),
                }
              );
            }
          }
        }
      } catch (error) {
        //
      }
    }

    return apply(operation);
  };

  return editor;
};
