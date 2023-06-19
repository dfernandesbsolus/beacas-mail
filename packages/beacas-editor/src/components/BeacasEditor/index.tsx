import React, { useCallback, useEffect, useMemo } from "react";
import { Editor, Node, Path, Transforms } from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  useSlate,
} from "slate-react";

import editorStyleText from "@beacas-editor/assets/editor.scss?inline";

import { Leaf } from "../Leaf";

import { isDOMNode } from "@beacas-editor/utils/isDOMElement";
import {
  NodeUtils,
  Element,
  ElementType,
  BlockManager,
  I18nManager,
} from "beacas-core";
import { debounce } from "lodash";
import { CustomEvent } from "@beacas-editor/constants";
import { useEditorProps, useRefState } from "@beacas-editor/hooks";
import { IframeComponent } from "../IframeComponent";
import { InteractiveState } from "./InteractiveState";
import { withEditorState } from "@beacas-editor/core/withEditorState";
import { withElementInteract } from "@beacas-editor/core/withElementInteract";
import { ElementComponent } from "../Elements";
import { useEditorState } from "@beacas-editor/hooks/useEditorState";
import { isDOMElement } from "@beacas-editor/utils";

const Com = withEditorState(withElementInteract(ElementComponent));

const BeacasEditorContent: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const {
    setHoverNodePath,
    setSelectedNodePath,
    universalElementEditing,
    universalElementPath,
  } = useEditorState();

  const universalElementEditingRef = useRefState(universalElementEditing);
  const universalElementPathRef = useRefState(universalElementPath);

  const context = useEditorProps();
  const editor = useSlate();

  let root: Window | null = null;
  try {
    root = ReactEditor.getWindow(editor);
  } catch (error) {}

  const renderElement = useCallback((props: RenderElementProps) => {
    return <Com {...props} />;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  const getElementNode = useCallback(
    (ev: React.PointerEvent | React.MouseEvent) => {
      if (!ev.target) return;

      const isPointerDownEvent = ev.type === "pointerdown";

      const universalElementPath = universalElementPathRef.current;

      try {
        let element = ReactEditor.toSlateNode(editor, ev.target as HTMLElement);
        let elementPath = ReactEditor.findPath(editor, element);

        if (universalElementEditingRef.current && universalElementPath) {
          if (
            !Path.isAncestor(universalElementPath, elementPath) &&
            !Path.equals(elementPath, universalElementPath)
          ) {
            return null;
          }
        }

        let voidEntry: [Node, Path] | undefined;

        const isUnsetElementClicked = Boolean(
          Editor.above(editor, {
            at: elementPath,
            match: (node) => NodeUtils.isUnsetElement(node),
          })
        );

        if (
          NodeUtils.isUniversalElement(element) ||
          NodeUtils.isVoidBlockElement(element)
        ) {
          voidEntry = [element, elementPath];
        } else {
          voidEntry = Editor.above(editor, {
            at: elementPath,
            match: (node) => {
              if (universalElementEditingRef.current) {
                return NodeUtils.isVoidBlockElement(node);
              }

              return (
                NodeUtils.isUniversalElement(node) ||
                NodeUtils.isVoidBlockElement(node)
              );
            },
          });
        }

        if (voidEntry) {
          element = voidEntry[0];
          elementPath = voidEntry[1];
        } else {
          const [nodeEntry] = Editor.nodes(editor, {
            at: elementPath,
            match: (node: Node, path: Path) => {
              if (
                !Path.equals(path, elementPath) &&
                !Path.isAncestor(path, elementPath)
              )
                return false;
              if (!NodeUtils.isBlockElement(node)) return false;
              if (NodeUtils.isUnsetElement(node)) return false;
              if (NodeUtils.isColumnElement(node)) return false;
              if (NodeUtils.isGroupElement(node)) return false;
              return true;
            },

            mode: "lowest",
          });

          if (!nodeEntry) return;
          element = nodeEntry[0];
          elementPath = nodeEntry[1];
        }

        if (NodeUtils.isContentElement(element)) {
          const block = BlockManager.getBlockByType(element.type);

          if (block.void || voidEntry || isUnsetElementClicked) {
            if (isPointerDownEvent) {
              ev.preventDefault();
              Transforms.deselect(editor);
            }
          }
        } else {
          if (isPointerDownEvent) {
            let textNode: HTMLElement | null = null;
            if (isDOMElement(ev.target)) {
              if (ev.target.getAttribute("data-slate-string") === "true") {
                textNode = ev.target;
              } else {
                textNode = ev.target.querySelector("[data-slate-string=true]");
              }
            }

            if (!textNode) {
              ev.preventDefault();
            }
          }
        }
        return elementPath;
      } catch (error) {
        // console.log(error);
      }
      return null;
    },
    [editor, universalElementEditingRef, universalElementPathRef]
  );

  useEffect(() => {
    const mouseoutHandler = debounce(() => {
      setHoverNodePath(null);
    });

    window.addEventListener("mouseout", mouseoutHandler);
    // 不能用 click 事件，否则 click section 的时候会先选到 text
    return () => {
      window.removeEventListener("mouseout", mouseoutHandler);
    };
  }, [setHoverNodePath]);

  const nodeEntry = editor.getSelectedBlockElement();

  useEffect(() => {
    if (!root || !editor.selection?.anchor.path) return;
    const nodeEntry = Editor.above(editor, {
      at: editor.selection?.anchor.path,
    });
    const node = nodeEntry?.[0] as Element;

    const nextPoint = Editor.next(editor)?.[1];
    if (node && node.type === ElementType.LINE_BREAK && nextPoint) {
      const point = Editor.start(editor, nextPoint);

      Transforms.select(editor, point);
    }
  }, [root, editor, nodeEntry]);

  const onPointerDown = useCallback(
    (ev: React.PointerEvent) => {
      if (context.readOnly) return;
      const path = getElementNode(ev);
      if (path) {
        setSelectedNodePath(path);
      }
    },
    [context.readOnly, getElementNode, setSelectedNodePath]
  );

  const onMouseMove = useCallback(
    (ev: React.MouseEvent) => {
      if (context.readOnly) return;
      const path = getElementNode(ev);
      if (path) {
        setHoverNodePath(path);
      }
    },
    [context.readOnly, getElementNode, setHoverNodePath]
  );

  const onClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();

      if (
        root &&
        isDOMNode(ev.target) &&
        ev.target !== root.document.documentElement
      ) {
        try {
          const node = ReactEditor.toSlateNode(editor, ev.target);
          const mergetagNodeEntry = Editor.above(editor, {
            at: ReactEditor.findPath(editor, node),
            match: (n) =>
              NodeUtils.isElement(n) && n.type === ElementType.MERGETAG,
          });

          if (mergetagNodeEntry) {
            Transforms.select(editor, mergetagNodeEntry[1]);
          }
        } catch (error) {}
      }

      window.dispatchEvent(new Event(CustomEvent.EDITOR_CLICK));
    },
    [editor, root]
  );

  if (context.localeData) {
    I18nManager.setLocaleData(context.localeData);
  }

  return useMemo(() => {
    return (
      <>
        <IframeComponent
          frameBorder="none"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
          }}
        >
          <div id="beacas-editor">
            <Editable
              onPointerDown={onPointerDown}
              onMouseMove={onMouseMove}
              onClick={onClick}
              autoFocus={false}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onDragStart={() => true}
              onDrop={() => true}
              onDOMBeforeInput={context.onDOMBeforeInput}
              onKeyDown={context.onKeyDown}
              readOnly={context.readOnly}
            />
          </div>

          <InteractiveState />

          <style>{editorStyleText}</style>
          {children}
        </IframeComponent>
      </>
    );
  }, [
    children,
    context.onDOMBeforeInput,
    context.onKeyDown,
    context.readOnly,
    onClick,
    onMouseMove,
    onPointerDown,
    renderElement,
    renderLeaf,
  ]);
};

export const BeacasEditor: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { universalElementEditing } = useEditorState();
  return (
    <BeacasEditorContent key={String(universalElementEditing)}>
      {children}
    </BeacasEditorContent>
  );
};
