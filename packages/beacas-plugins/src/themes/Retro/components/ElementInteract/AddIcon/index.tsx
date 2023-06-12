import { isDOMElement } from "beacas-editor";
import { observer } from "mobx-react";
import React from "react";
import { Transforms, Text, Editor } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import AddIconSvg from "@beacas-plugins/assets/images/icons/add-icon.svg";
import { store } from "@beacas-plugins/store";

export const AddIcon = observer(() => {
  const editor = useSlateStatic();

  const onAddButtonClick: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    if (!isDOMElement(ev.target)) return;

    if (ev.altKey) {
      let node = ReactEditor.toSlateNode(editor, ev.target);
      let nodePath = ReactEditor.findPath(editor, node);
      if (Text.isText(node)) {
        const parent = Editor.parent(editor, nodePath);
        node = parent[0];
        nodePath = parent[1];
      }

      editor.splitColumns({ path: nodePath });

      setTimeout(() => {
        const rect = editor.getSelectionRect();
        if (rect) {
          store.ui.setBlockMenusOverlayVisible(true);
        }
      }, 10);
    } else {
      const node = ReactEditor.toSlateNode(editor, ev.target);
      const nodePath = ReactEditor.findPath(editor, node);
      const at = Editor.end(editor, nodePath);
      Transforms.select(editor, at);
      Transforms.setSelection(editor, { anchor: at, focus: at });

      editor.insertBreak();
      // setTimeout(() => {
      //   const rect = editor.getSelectionRect();
      //   if (rect) {
      //     store.ui.setBlockMenusOverlayVisible(true);
      //   }
      // }, 10);
    }
  };

  return (
    <div
      className="button add-icon"
      role="button"
      onMouseDown={onAddButtonClick}
      style={{
        cursor: "pointer",
      }}
    >
      <AddIconSvg />
    </div>
  );
});
