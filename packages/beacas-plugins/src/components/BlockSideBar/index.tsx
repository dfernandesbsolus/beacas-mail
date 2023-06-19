import React, { useCallback, useEffect, useState } from "react";
import { Tabs } from "@arco-design/web-react";

import stylesText from "./index.scss?inline";
import { classnames, t } from "beacas-core";

import { BlocksPanel } from "./BlocksPanel";
import { AttributePanel } from "../ConfigurationPanel/components/AttributePanel";
import { ConfigurationDrawer } from "../ConfigurationDrawer";
import {
  useEditorContext,
  useEditorState,
  useSelectedNode,
} from "beacas-editor";
import { SharedComponents } from "..";

export interface BlockSideBarProps {
  height: string;
}

export const BlockSideBar = ({ height }: BlockSideBarProps) => {
  const { setSelectedNodePath, selectedNodePath, universalElementEditing } =
    useEditorState();

  const { hasAuth } = useEditorContext();
  const { selectedNode } = useSelectedNode();
  const [activeTab, setActiveTab] = useState("Content");

  const onChange = useCallback(
    (key: string) => {
      if (key === "Style") {
        setSelectedNodePath([0]);
      }
      setActiveTab(key);
    },
    [setSelectedNodePath]
  );

  const onClose = useCallback(() => {
    setActiveTab("Content");
  }, []);

  useEffect(() => {
    if (selectedNodePath && !selectedNode) {
      setActiveTab("Content");
      setSelectedNodePath(null);
    }
  }, [selectedNode, selectedNodePath, setSelectedNodePath]);

  if (!hasAuth) return null;

  if (universalElementEditing) {
    return (
      <>
        <SharedComponents.FullHeightOverlayScrollbars
          height={`calc(${height} - 60px)`}
        >
          <BlocksPanel />
        </SharedComponents.FullHeightOverlayScrollbars>
        <SharedComponents.ConfigurationDrawer
          height={`calc(${height} - 60px)`}
          onClose={onClose}
        />
        <style>{stylesText}</style>
      </>
    );
  }
  return (
    <>
      <Tabs
        activeTab={activeTab}
        className={classnames("BlockSideBar")}
        onChange={onChange}
      >
        <Tabs.TabPane key="Content" title={<div>{t("Element")}</div>}>
          <SharedComponents.FullHeightOverlayScrollbars
            height={`calc(${height} - 60px)`}
          >
            <BlocksPanel />
          </SharedComponents.FullHeightOverlayScrollbars>
        </Tabs.TabPane>

        <Tabs.TabPane destroyOnHide key="Style" title={<div>{t("Style")}</div>}>
          <SharedComponents.FullHeightOverlayScrollbars
            height={`calc(${height} - 60px)`}
          >
            <AttributePanel />
          </SharedComponents.FullHeightOverlayScrollbars>
        </Tabs.TabPane>
      </Tabs>
      <ConfigurationDrawer
        height={`calc(${height} - 60px)`}
        onClose={onClose}
      />
      <style>{stylesText}</style>
    </>
  );
};
