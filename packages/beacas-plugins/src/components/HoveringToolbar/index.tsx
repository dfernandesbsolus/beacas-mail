import { useEditorProps, TextFormat, useSelectedNode } from "beacas-editor";
import { NodeUtils } from "beacas-core";
import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Editor, Node, Range, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import "./HoveringToolbar.scss";
import { getElementPageLayout } from "@beacas-plugins/utils/getElementPageLayout";
import styleText from "@beacas-plugins/assets/font/iconfont.css?inline";
import { RichTextBar } from "./RichTextBar";

export const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const { hoveringToolbar } = useEditorProps();
  const { selectedNode } = useSelectedNode();
  const { selection } = editor;
  const nodePath =
    selectedNode && selection?.anchor.path ? selection.anchor.path : null;

  const selectedContentBlockNodeEntry = nodePath
    ? Editor.above(editor, {
        at: nodePath,
        match: NodeUtils.isContentElement,
      })
    : null;

  const selectedContentBlockNode = selectedContentBlockNodeEntry?.[0];
  const isNotSelect = !selection;

  const isCollapsed = Boolean(
    selection &&
      (Range.isCollapsed(selection) || Editor.string(editor, selection) === "")
  );

  useEffect(() => {
    try {
      const el = ref.current;

      const doc = ReactEditor.findDocumentOrShadowRoot(editor);
      const contentWindow = ReactEditor.getWindow(editor);
      if (!el || el.contains(doc.activeElement)! || !selectedContentBlockNode) {
        return;
      }

      if (isNotSelect) {
        el.removeAttribute("style");
        return;
      }
      const domSelection = contentWindow.getSelection();
      if (!domSelection) return;

      const domRange = domSelection.getRangeAt(0);
      let rect = domRange.getBoundingClientRect();
      if (rect.top === 0 && rect.left === 0 && editor.selection?.anchor.path) {
        const textNode = Node.get(editor, editor.selection?.anchor.path);
        const rangeNode = ReactEditor.toDOMNode(editor, textNode);

        const rang = document.createRange();
        rang.selectNode(rangeNode);
        rect = rang.getBoundingClientRect();
        Transforms.select(editor, editor.selection);
      }

      const layout = getElementPageLayout({
        editor,
        overlayElement: el,
        relativedElement: ReactEditor.toDOMNode(
          editor,
          selectedContentBlockNode
        ),
      });

      if (!layout) return;

      const {
        isTopEnough,
        iframeRect,
        relativedElementReact,
        overlayRect,
        pageYOffset,
      } = layout;

      el.style.opacity = "1";

      el.style.top = `${
        isTopEnough
          ? pageYOffset - overlayRect.height - 10
          : pageYOffset + relativedElementReact.height + 10
      }px`;
      el.style.left = `${rect.left + iframeRect.left - 30}px`;
    } catch (error) {}
  });

  const isShowHoveringBar =
    selectedContentBlockNode &&
    NodeUtils.isTextElement(selectedContentBlockNode);

  const isShowTurnInto =
    isShowHoveringBar && !NodeUtils.isTextListElement(selectedContentBlockNode);

  const list = useMemo((): TextFormat[] => {
    if (hoveringToolbar?.list) {
      return hoveringToolbar
        ?.list?.({ isCollapsed, selection })
        .filter((item) => {
          if (item === TextFormat.TURN_INTO) {
            return isShowTurnInto && nodePath;
          }
          return true;
        });
    }
    return isCollapsed
      ? [] //([TextFormat.TURN_INTO, TextFormat.MERGETAG, TextFormat.ALIGN] as const)
      : [
          TextFormat.FONT_FAMILY,
          TextFormat.FONT_SIZE,
          TextFormat.BOLD,
          TextFormat.ITALIC,
          TextFormat.UNDERLINE,
          TextFormat.STRIKETHROUGH,
          TextFormat.TEXT_COLOR,
          TextFormat.BACKGROUND_COLOR,
          TextFormat.LINK,
          TextFormat.MERGETAG,
          TextFormat.REMOVE_FORMAT,
        ].filter((item) => {
          if (item === TextFormat.TURN_INTO) {
            return isShowTurnInto && nodePath;
          }
          return true;
        });
  }, [hoveringToolbar, isCollapsed, isShowTurnInto, nodePath, selection]);

  if (!list.length) return null;

  if (!isShowHoveringBar) return null;

  return createPortal(
    <div
      ref={ref}
      key={String(isNotSelect)}
      id="HoveringToolbar"
      className={"HoveringToolbar RichTextBar"}
      onMouseDown={(e) => {
        // prevent toolbar from taking focus away from editor
        e.preventDefault();
      }}
    >
      <div className="HoveringToolbarWrapper">
        {hoveringToolbar?.prefix}
        <RichTextBar list={list} />
        {hoveringToolbar?.subfix}
      </div>

      <style>{styleText}</style>
    </div>,
    document.body
  );
};
