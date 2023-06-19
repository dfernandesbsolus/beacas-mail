import React, { useRef, useState } from "react";
import { Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import MoreIconSvg from "@beacas-plugins/assets/images/icons/more-icon.svg";
import { isDOMElement } from "beacas-editor";
import { t } from "beacas-core";
import styleText from "./index.scss?inline";
import { MoreActionsMenusOverlay } from "@beacas-plugins/themes/Minimalist/components/ImageAction/MoreActionsMenusOverlay";

export const MoreIcon = ({
  isHover,
  onToggleImageActionVisible,
}: {
  isHover: boolean;
  onToggleImageActionVisible: (ev: Event) => void;
}) => {
  const editor = useSlateStatic();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const moreIconRef = useRef<HTMLDivElement | null>(null);

  const onToggle: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    if (isDOMElement(ev.target)) {
      ev.preventDefault();
      if (visible) {
        setVisible(false);
        return;
      }
      const node = ReactEditor.toSlateNode(editor, ev.target);
      const nodePath = ReactEditor.findPath(editor, node);

      Transforms.select(editor, nodePath);

      const domNode = ReactEditor.toDOMNode(editor, node);

      const rect = domNode.getBoundingClientRect();

      if (rect) {
        setPosition({
          top: rect.top,
          left: rect.left + rect.width + 10,
        });
        setVisible(true);
      }
    }
  };

  return (
    <>
      <div
        ref={moreIconRef}
        title={t(`More actions`)}
        className="more-icon beacas-image-MoreIcon"
        role="button"
        style={{ opacity: isHover ? 1 : 0 }}
        onPointerDown={onToggle}
      >
        <MoreIconSvg />
        <style>{styleText}</style>
      </div>
      <MoreActionsMenusOverlay
        visible={visible}
        setVisible={setVisible}
        left={position.left}
        top={position.top}
        onToggleImageActionVisible={onToggleImageActionVisible}
        moreIconRef={moreIconRef}
      />
    </>
  );
};
