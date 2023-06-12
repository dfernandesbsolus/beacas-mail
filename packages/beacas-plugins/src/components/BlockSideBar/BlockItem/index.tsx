import { useDragging } from "@beacas-plugins/hooks";
import { BlockManager, Element, NodeUtils } from "beacas-core";
import { useEditorState } from "beacas-editor";
import React, { useMemo } from "react";
import "./index.scss";

export function BlockItem({
  type,
  payload,
  title,
  icon,
}: {
  type: Element["type"];
  payload?: Partial<Element>;
  title?: string;
  icon?: React.ReactNode;
}) {
  const { universalElementEditing } = useEditorState();
  const block = BlockManager.getBlockByType(type);

  const element = useMemo(() => block.create(payload as any), [block, payload]);

  const { dragHandle } = useDragging({
    element: element,
    nodeElement: null,
    action: "copy",
    cloneGhost: false,
  });

  if (universalElementEditing && !NodeUtils.isContentElement(element))
    return null;

  return (
    <div className={"block-list-grid-item"} {...dragHandle}>
      <div className={"blockItemContainer"}>
        <div>{icon}</div>
        <div style={{ width: "100%" }}>{title || block?.name}</div>
      </div>
    </div>
  );
}
