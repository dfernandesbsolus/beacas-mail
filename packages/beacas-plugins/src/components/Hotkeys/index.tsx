import { NodeUtils } from "beacas-core";
import {
  toggleFormat,
  TextFormat,
  useRefState,
  useEditorProps,
  useEditorContext,
  useSelectedNode,
} from "beacas-editor";
import React, { useEffect } from "react";
import { Editor, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import Shortcut from "@beacas-plugins/utils/hotkeys";
import { useEditorForm } from "@beacas-plugins/hooks";

export const Hotkeys: React.FC<{}> = () => {
  const editor = useSlate();
  const editorProps = useEditorProps();
  const propsKeydown = useRefState(editorProps.onKeyDown);
  const propsSubmit = useRefState(editorProps.onSubmit);
  const { values } = useEditorContext();
  const valuesRef = useRefState(values);
  const { setFieldValue } = useEditorForm();
  const { selectedNodePath } = useSelectedNode();

  let root: Window | null = null;

  try {
    root = ReactEditor.getWindow(editor);
  } catch (error) {}

  useEffect(() => {
    if (!root) return;
    const onKeyDown: React.DOMAttributes<HTMLDivElement>["onKeyDown"] = (
      ev
    ) => {
      if (propsKeydown.current?.(ev as any)) return;

      const nativeEvent = ev;
      if (Shortcut.isUndo(nativeEvent)) {
        ev.preventDefault();
        editor.undo();
      } else if (Shortcut.isRedo(nativeEvent)) {
        ev.preventDefault();
        editor.redo();
      } else if (Shortcut.isFormatBold(nativeEvent)) {
        ev.preventDefault();
        toggleFormat(editor, TextFormat.BOLD);
      } else if (Shortcut.isFormatItalic(nativeEvent)) {
        ev.preventDefault();
        toggleFormat(editor, TextFormat.ITALIC);
      } else if (Shortcut.isFormatUnderline(nativeEvent)) {
        ev.preventDefault();
        toggleFormat(editor, TextFormat.UNDERLINE);
      } else if (Shortcut.isSelectBlock(nativeEvent)) {
        ev.preventDefault();
        const nodeEntry = Editor.above(editor, {
          match: NodeUtils.isContentElement,
        });
        if (!nodeEntry) return;
        Transforms.select(editor, nodeEntry[1]);
      } else if (Shortcut.isMergeTag(nativeEvent)) {
        ev.preventDefault();
        if (!editor.selection) return;

        editor.insertMergetag({
          mergetag: Editor.string(editor, editor.selection),
        });
      } else if (Shortcut.isSave(nativeEvent)) {
        ev.preventDefault();
        propsSubmit.current(valuesRef.current);
      } else if (Shortcut.alignCenter(nativeEvent)) {
        ev.preventDefault();
        if (selectedNodePath) {
          setFieldValue(selectedNodePath, "attributes.align", "center");
        }
      } else if (Shortcut.alignLeft(nativeEvent)) {
        ev.preventDefault();
        if (selectedNodePath) {
          setFieldValue(selectedNodePath, "attributes.align", "left");
        }
      } else if (Shortcut.alignRight(nativeEvent)) {
        ev.preventDefault();
        if (selectedNodePath) {
          setFieldValue(selectedNodePath, "attributes.align", "right");
        }
      }
    };
    root.addEventListener("keydown", onKeyDown as any);

    return () => {
      root?.removeEventListener("keydown", onKeyDown as any);
    };
  }, [
    editor,
    propsKeydown,
    propsSubmit,
    root,
    selectedNodePath,
    setFieldValue,
    valuesRef,
  ]);

  useEffect(() => {
    const onKeyDown: React.DOMAttributes<HTMLDivElement>["onKeyDown"] = (
      ev
    ) => {
      if (propsKeydown.current?.(ev as any)) return;

      const nativeEvent = ev;
      if (Shortcut.isUndo(nativeEvent)) {
        ev.preventDefault();
        editor.undo();
      } else if (Shortcut.isRedo(nativeEvent)) {
        ev.preventDefault();
        editor.redo();
      } else if (Shortcut.isSave(nativeEvent)) {
        ev.preventDefault();
        propsSubmit.current(valuesRef.current);
      } else if (Shortcut.alignCenter(nativeEvent)) {
        ev.preventDefault();
        if (selectedNodePath) {
          setFieldValue(selectedNodePath, "attributes.align", "center");
        }
      } else if (Shortcut.alignLeft(nativeEvent)) {
        ev.preventDefault();
        if (selectedNodePath) {
          setFieldValue(selectedNodePath, "attributes.align", "left");
        }
      } else if (Shortcut.alignRight(nativeEvent)) {
        ev.preventDefault();
        if (selectedNodePath) {
          setFieldValue(selectedNodePath, "attributes.align", "right");
        }
      }
    };
    window.addEventListener("keydown", onKeyDown as any);

    return () => {
      window.removeEventListener("keydown", onKeyDown as any);
    };
  }, [
    editor,
    propsKeydown,
    propsSubmit,
    selectedNodePath,
    setFieldValue,
    valuesRef,
  ]);

  return <></>;
};
