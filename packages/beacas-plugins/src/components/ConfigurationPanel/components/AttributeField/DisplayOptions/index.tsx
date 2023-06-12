import { Space } from "@arco-design/web-react";
import { IconFont } from "@beacas-plugins/components/IconFont";
import { classnames, t } from "beacas-core";
import { useSelectedNode } from "beacas-editor";
import React from "react";
import { useSlate } from "slate-react";
import { Condition } from "./Condition";
import { Iteration } from "./Iteration";
import "./index.scss";
import { useEditorForm } from "@beacas-plugins/hooks";

export const DisplayOptions = () => {
  const editor = useSlate();
  const { selectedNode, selectedNodePath } = useSelectedNode();

  const { getFieldValue, setFieldValue } = useEditorForm();
  if (!selectedNodePath || !selectedNode) return null;

  const onSetDisplayMode = (v: string) => {
    setFieldValue(selectedNodePath, "visible", v);
  };

  const value = getFieldValue(selectedNodePath, "visible");

  return (
    <>
      <div
        style={{
          display: "flex",
          padding: "50px 0px",
          justifyContent: "space-evenly",
        }}
      >
        <div
          onClick={() => onSetDisplayMode("")}
          className={classnames(
            "ResponsiveTabsItem",
            value === "" && "displayItemActive"
          )}
        >
          <div>
            <Space>
              <IconFont iconName="icon-desktop" size={24} />
              <IconFont iconName="icon-mobile" size={24} />
            </Space>
          </div>
          <div style={{ textAlign: "center" }}>
            <small>{t("Desktop/Mobile")}</small>
          </div>
        </div>
        <div
          onClick={() => onSetDisplayMode("desktop")}
          className={classnames(
            "ResponsiveTabsItem",
            value === "desktop" && "displayItemActive"
          )}
        >
          <div>
            <Space>
              <IconFont iconName="icon-desktop" size={24} />
            </Space>
          </div>
          <div style={{ textAlign: "center" }}>{t("Desktop")}</div>
        </div>
        <div
          onClick={() => onSetDisplayMode("mobile")}
          className={classnames(
            "ResponsiveTabsItem",
            value === "mobile" && "displayItemActive"
          )}
        >
          <div>
            <Space>
              <IconFont iconName="icon-mobile" size={24} />
            </Space>
          </div>
          <div style={{ textAlign: "center" }}>{t("Mobile")}</div>
        </div>
      </div>
      <Condition
        editor={editor}
        nodePath={selectedNodePath}
        selectedBlock={selectedNode}
      />
      <Iteration
        editor={editor}
        nodePath={selectedNodePath}
        selectedBlock={selectedNode}
      />
    </>
  );
};
