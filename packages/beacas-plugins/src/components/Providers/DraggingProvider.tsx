import { Element, NodeUtils, PageElement, TextNode } from "beacas-core";
import {
  isDOMElement,
  useEditorProps,
  useEditorState,
  useRefState,
} from "beacas-editor";
import { cloneDeep } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Editor, Node, Path, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

export interface DraggingPropsData {
  element: Element;
  nodeElement: HTMLElement | null;
  action: "move" | "copy";
  cloneGhost?: boolean;
}

export const DraggingProviderContext = React.createContext<{
  propsDataRef: React.MutableRefObject<DraggingPropsData | null>;
  dragHandle: {
    onPointerDown(event: React.PointerEvent<any>): void;
    onDragStart(ev: React.DragEvent<any>): void;
    onDragEnd(): void;
    draggable: boolean;
  };
}>({} as any);

export const DraggingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const propsDataRef = useRef<DraggingPropsData | null>(null);

  const {
    setDragNodePath,
    setHoverNodePath,
    dragNodePath,
    setSelectedNodePath,
  } = useEditorState();
  const editorProps = useEditorProps();
  const quantityLimitCheck = useRefState(editorProps.quantityLimitCheck);
  const editor = useSlate();

  let root: Document | null = null;
  try {
    root = ReactEditor.getWindow(editor).document;
  } catch (error) {}

  const isDragging = useRefState(dragNodePath);

  const removePlaceholder = useCallback(() => {
    const rootDoc = ReactEditor.getWindow(editor).document;
    rootDoc.getElementById("dragging-placeholder")?.remove();
  }, [editor]);

  const removeDraggingStyle = useCallback(() => {
    if (!root) return;
    root
      .querySelectorAll("[data-slate-dragover='true']")
      .forEach((item) => item.removeAttribute("data-slate-dragover"));
    root
      .querySelectorAll("[data-slate-dragover-direction]")
      .forEach((item) => item.removeAttribute("data-slate-dragover-direction"));
    root.body.removeAttribute("data-slate-dragging");
    setDragNodePath(null);
  }, [root, setDragNodePath]);

  useEffect(() => {
    if (!root) return;
    if (editorProps.readOnly) return;

    const onDragover = (ev: DragEvent) => {
      const propsData = propsDataRef.current;

      if (!propsData) return;

      if (!root) return;
      if (!ev.target) {
        return;
      }

      if (ev.dataTransfer) {
        ev.dataTransfer.dropEffect = propsData.action;
      }

      const removeSelectedStyle = () => {
        root
          ?.querySelectorAll("[data-slate-dragover='true']")
          .forEach((item) => item.removeAttribute("data-slate-dragover"));
      };

      if (
        isDOMElement(ev.target) &&
        root.contains(ev.target) &&
        ev.target !== root.documentElement
      ) {
        let dropElement = ReactEditor.toSlateNode(editor, ev.target) as
          | Element
          | TextNode
          | undefined;

        if (!dropElement) return;

        let dropPath = ReactEditor.findPath(editor, dropElement!);

        let source: Path | null = null;
        if (propsData?.action === "move") {
          source = ReactEditor.findPath(editor, propsData.element);
        }

        if (source && Path.equals(dropPath, source)) {
          removeSelectedStyle();
          return;
        }

        const [dropNodeEntry] = Editor.nodes(editor, {
          at: dropPath,
          match: (node: Node, path: Path) => {
            if (
              !Path.isAncestor(path, dropPath) &&
              !Path.equals(path, dropPath)
            )
              return false;

            if (!NodeUtils.isBlockElement(node)) return false;
            if (NodeUtils.isUnsetElement(node)) return false;
            if (NodeUtils.isPageElement(node)) return false;
            if (
              NodeUtils.isParentCategoryType(
                propsData.element.type,
                node.type
              ) &&
              !NodeUtils.isVoidBlockElement(node)
            ) {
              return true;
            }

            const parentPath = Path.parent(path);
            const parentElement = Node.get(editor, parentPath) as Element;
            if (Editor.isEditor(node)) return false;
            if (!parentElement || !parentElement.type) return false; // maybe parent is editor

            const voidElementParent = Editor.above(editor, {
              at: path,
              match: (node: Node) => {
                if (NodeUtils.isVoidBlockElement(node)) return true;
                return false;
              },
            });

            if (voidElementParent) {
              return false;
            }

            if (
              NodeUtils.isParentCategoryType(
                propsData.element.type,
                parentElement.type
              )
            ) {
              return true;
            }

            return false;
          },
          mode: "lowest",
        });

        dropElement = dropNodeEntry?.[0] as Element | undefined;
        dropPath = dropNodeEntry?.[1] as Path;

        if (!dropElement) {
          removeSelectedStyle();
          return;
        }

        if (dropPath && source && Path.equals(dropPath, source)) {
          removeSelectedStyle();
          return;
        }

        ev.preventDefault();
        const node = ReactEditor.toDOMNode(editor, dropElement);

        const rect = node.getBoundingClientRect();

        const isTop = ev.clientY < rect.y + rect.height / 3;

        root
          .querySelectorAll("[data-slate-dragover='true']")
          .forEach((item) => {
            if (item !== node) {
              item.removeAttribute("data-slate-dragover");
            }
          });
        node?.setAttribute("data-slate-dragover", "true");

        let direction = "bottom";
        if (isTop) {
          direction = "top";
        }
        if (
          NodeUtils.isParentCategoryType(
            propsData.element.type,
            dropElement.type
          ) &&
          !NodeUtils.isVoidBlockElement(dropElement)
        ) {
          direction = "middle";
        }

        node?.setAttribute("data-slate-dragover-direction", direction);
      } else {
        removeSelectedStyle();
      }
    };

    const onDrop = (ev: DragEvent) => {
      removePlaceholder();
      const propsData = propsDataRef.current;

      if (!propsData) return;
      if (isDOMElement(ev.target) && ev.target !== root?.documentElement) {
        let source: Path | null = null;
        if (propsData?.action === "move") {
          source = ReactEditor.findPath(editor, propsData.element);
        } else {
          // check quantify limit
          if (
            quantityLimitCheck.current &&
            !quantityLimitCheck.current({
              element: propsData.element,
              pageData: editor.children[0] as PageElement,
            })
          ) {
            return;
          }
        }

        let dropElement = ReactEditor.toSlateNode(editor, ev.target) as
          | Element
          | TextNode
          | undefined;

        let dropPath = ReactEditor.findPath(editor, dropElement!);

        if (dropPath && dropElement) {
          ev.preventDefault();
          ev.stopPropagation();

          const dropParent = Editor.parent(editor, dropPath)[0] as Element;

          const [dropNodeEntry] = Editor.nodes(editor, {
            at: dropPath,
            match: (node: Node, path: Path) => {
              if (
                !Path.isAncestor(path, dropPath) &&
                !Path.equals(path, dropPath)
              )
                return false;

              if (!NodeUtils.isBlockElement(node)) return false;
              if (NodeUtils.isPageElement(node)) return false;
              if (NodeUtils.isUnsetElement(node)) return false;
              if (
                NodeUtils.isParentCategoryType(
                  propsData.element.type,
                  node.type
                ) &&
                !NodeUtils.isVoidBlockElement(node)
              ) {
                return true;
              }

              const parentPath = Path.parent(path);
              const parentElement = Node.get(editor, parentPath) as Element;
              if (Editor.isEditor(node)) return false;
              if (!parentElement || !parentElement.type) return false; // maybe parent is editor

              if (
                NodeUtils.isParentCategoryType(
                  propsData.element.type,
                  parentElement.type
                )
              ) {
                return true;
              }

              return false;
            },
            mode: "lowest",
          });

          dropElement = dropNodeEntry?.[0] as Element | undefined;
          dropPath = dropNodeEntry?.[1] as Path;

          if (!dropElement) {
            return;
          }

          const node = ReactEditor.toDOMNode(editor, dropElement);
          const rect = node.getBoundingClientRect();

          const isTop = ev.clientY < rect.y + rect.height / 3;
          const isInsert =
            NodeUtils.isParentCategoryType(
              propsData.element.type,
              dropElement.type
            ) && !NodeUtils.isVoidBlockElement(dropElement);

          let targetPath = [...dropPath];
          if (propsData.action === "move") {
            if (!source) return;

            if (isInsert) {
              editor.moveNode({
                at: [...source],
                to: [...targetPath, 0],
              });
            } else if (isTop) {
              editor.moveNode({
                at: [...source],
                to: targetPath,
              });
            } else {
              const dropIndex = targetPath.pop()!;

              const sourceIndex = source[source.length - 1];
              if (Editor.parent(editor, source)[0] === dropParent) {
                if (sourceIndex !== dropIndex) {
                  if (sourceIndex <= dropIndex) {
                    targetPath.push(dropIndex);
                  } else {
                    targetPath.push(dropIndex + 1);
                  }
                }
              } else {
                targetPath.push(dropIndex + 1);
              }
              editor.moveNode({
                at: [...source],
                to: targetPath,
              });
              setTimeout(() => {
                setSelectedNodePath(targetPath);
              }, 0);
            }
          } else {
            const cloneElement = cloneDeep(propsData.element);
            if (isInsert) {
              targetPath = [...targetPath, 0];
              Transforms.insertNodes(editor, cloneElement, {
                at: targetPath,
              });
            } else {
              targetPath = isTop ? targetPath : Path.next(targetPath);
              Transforms.insertNodes(editor, cloneElement, {
                at: targetPath,
              });
            }
            setTimeout(() => {
              setSelectedNodePath(targetPath);
            }, 0);
          }
        }
      }

      removeDraggingStyle();
      setHoverNodePath(null);
    };

    const onMousemove = (event: MouseEvent) => {
      if (isDragging.current) {
        removeDraggingStyle();
        setHoverNodePath(null);
        removePlaceholder();
        removePlaceholder();
      }
    };

    root.addEventListener("dragover", onDragover, false);
    root.addEventListener("mousemove", onMousemove);
    root.addEventListener("drop", onDrop);

    return () => {
      root?.removeEventListener("dragover", onDragover, false);
      root?.removeEventListener("drop", onDrop);
      root?.removeEventListener("mousemove", onMousemove);
    };
  }, [
    editor,
    editorProps.readOnly,
    isDragging,
    quantityLimitCheck,
    removeDraggingStyle,
    removePlaceholder,
    root,
    setHoverNodePath,
    setSelectedNodePath,
  ]);

  const dragHandle = useMemo(() => {
    return {
      onPointerDown(event: React.PointerEvent<any>) {
        event.stopPropagation();
      },
      onDragStart(ev: React.DragEvent<any>) {
        if (editorProps.readOnly) return;
        const propsData = propsDataRef.current;
        if (propsData?.cloneGhost) {
          const rect = propsData.nodeElement!.getBoundingClientRect();
          const crt = propsData.nodeElement!.cloneNode(true) as HTMLElement;
          crt.id = "dragging-placeholder";
          crt.style.position = "absolute";
          crt.style.left = rect.left + "px";
          crt.style.top = rect.top + "px";
          crt.style.width = rect.width + "px";

          crt.style.zIndex = "10000";
          crt.style.pointerEvents = "none";
          propsData.nodeElement?.parentElement?.insertBefore(
            crt,
            propsData.nodeElement
          );

          if (ev.dataTransfer) {
            ev.dataTransfer.setDragImage(crt, 0, -0);
          }
          crt.style.left = "-10000px";
          crt.style.top = "-10000px";
        }

        if (propsData?.action === "move") {
          setDragNodePath(ReactEditor.findPath(editor, propsData.element));
        }
      },
      onDragEnd() {
        removeDraggingStyle();
        setHoverNodePath(null);
        removePlaceholder();
      },
      draggable: true,
    };
  }, [
    editor,
    editorProps.readOnly,
    removeDraggingStyle,
    removePlaceholder,
    setDragNodePath,
    setHoverNodePath,
  ]);

  const value = useMemo(() => {
    return {
      propsDataRef,
      dragHandle,
    };
  }, [dragHandle]);

  return (
    <DraggingProviderContext.Provider value={value}>
      {children}
    </DraggingProviderContext.Provider>
  );
};
