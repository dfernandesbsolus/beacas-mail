import { observer } from "mobx-react";
import React from "react";
import { Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import MoreIconSvg from "@beacas-plugins/assets/images/icons/more-icon.svg";
import { isDOMElement } from "beacas-editor";
import { store } from "@beacas-plugins/store";

export const MoreIcon = observer(() => {
  const editor = useSlateStatic();

  const onToggle: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    if (isDOMElement(ev.target)) {
      ev.preventDefault();
      ev.stopPropagation();
      if (store.ui.moreActionsMenusOverlay.visible) {
        store.ui.setMoreActionsMenusOverlayVisible(false);
        return;
      }
      const node = ReactEditor.toSlateNode(editor, ev.target);
      const nodePath = ReactEditor.findPath(editor, node);

      Transforms.select(editor, nodePath);

      const domNode = ReactEditor.toDOMNode(editor, node);

      const rect = domNode.getBoundingClientRect();

      if (rect) {
        store.ui.setMoreActionsMenusOverlayPosition({
          top: rect.top,
          left: rect.left + rect.width + 10,
        });
        store.ui.setMoreActionsMenusOverlayVisible(true);
      }
    }
  };

  return (
    <div className=" more-icon" role="button" onMouseDown={onToggle}>
      <img src={MoreIconSvg} alt="" />
    </div>
  );
});
