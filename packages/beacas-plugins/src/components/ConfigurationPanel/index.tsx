import React, { useMemo } from "react";

import "./index.scss";
import { AttributePanel } from "./components/AttributePanel";
import { BlockManager, Element, NodeUtils, PageElement } from "beacas-core";
import { useSlate } from "slate-react";
import { Node, Path } from "slate";
import { IconCopy, IconDelete, IconLeft } from "@arco-design/web-react/icon";
import { Button, Divider, Space } from "@arco-design/web-react";
import {
  useEditorState,
  useEditorProps,
  useEventCallback,
} from "beacas-editor";
import { UniversalElementPanel } from "./components/UniversalElementPanel";
import { useElementInteract } from "@beacas-plugins/hooks/useElementInteract";
import { SharedComponents } from "..";

export interface ConfigurationPanelProps {
  showSourceCode?: boolean;
  height: string;
  onClose: () => void;
}

export const ConfigurationPanel = ({
  height,
  onClose,
}: ConfigurationPanelProps) => {
  const editor = useSlate();

  const { selectedNodePath, universalElementEditing, universalElementPath } =
    useEditorState();
  const { quantityLimitCheck } = useEditorProps();

  const { copyBlock, deleteBlock } = useElementInteract();

  const onCopy = useEventCallback((path: Path) => {
    if (
      quantityLimitCheck &&
      !quantityLimitCheck({
        element: Node.get(editor, path) as Element,
        pageData: editor.children[0] as PageElement,
      })
    ) {
      return;
    }
    copyBlock(path);
  });

  let element: Element | null = null;
  if (selectedNodePath!) {
    try {
      element = Node.get(editor, selectedNodePath) as Element;
    } catch (error) {}
  }

  return useMemo(() => {
    if (!element || !selectedNodePath) return null;

    const isSelectedUniversalElement =
      universalElementPath &&
      Path.equals(selectedNodePath, universalElementPath);

    return (
      <>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            height: 60,
            lineHeight: "60px",
            textAlign: "center",
          }}
        >
          {(!isSelectedUniversalElement ||
            NodeUtils.isSectionElement(element)) && (
            <IconLeft
              fontSize={24}
              style={{
                cursor: "pointer",
                color: "rgb(var(--primary-6))",
                paddingLeft: 10,
                paddingRight: 5,
              }}
              onClick={onClose}
            />
          )}
          <div style={{ flex: 1 }}> {BlockManager.getBlockTitle(element)}</div>
          {!isSelectedUniversalElement && (
            <Space>
              <Button
                onClick={() => onCopy(selectedNodePath)}
                size="small"
                icon={<IconCopy />}
              ></Button>

              <Button
                onClick={() => deleteBlock(selectedNodePath)}
                size="small"
                icon={<IconDelete />}
              ></Button>
            </Space>
          )}
          <div style={{ marginRight: 10 }} />
        </div>
        <Divider style={{ margin: 0 }} />
        <SharedComponents.FullHeightOverlayScrollbars
          height={`calc(${height} - 60px)`}
        >
          {NodeUtils.isUniversalElement(element) && !universalElementEditing ? (
            <UniversalElementPanel />
          ) : (
            <AttributePanel />
          )}
        </SharedComponents.FullHeightOverlayScrollbars>
      </>
    );
  }, [
    deleteBlock,
    element,
    height,
    onClose,
    onCopy,
    selectedNodePath,
    universalElementEditing,
    universalElementPath,
  ]);
};
