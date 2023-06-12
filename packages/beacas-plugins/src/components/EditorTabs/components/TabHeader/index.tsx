import { Button, Space } from "@arco-design/web-react";
import { IconFont } from "@beacas-plugins/components/IconFont";
import { t } from "beacas-core";
import React, { useCallback } from "react";
import { ActiveTabKeys, useEditorState } from "beacas-editor";

export const TabHeader: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
}> = (props) => {
  const { setActiveTab, activeTab } = useEditorState();
  const onChangeTab = useCallback(
    (tab: ActiveTabKeys) => {
      setActiveTab(tab);
    },
    [setActiveTab]
  );

  const isMobileActive = activeTab === ActiveTabKeys.MOBILE;
  const grid = "2vw";
  return (
    <>
      <div
        style={{
          height: 60,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ position: "absolute", left: 0 }}>{props.left}</div>
        <div style={{ textAlign: "center" }}>
          <Button.Group>
            <Button
              style={{ paddingLeft: grid, paddingRight: grid }}
              type={!isMobileActive ? "outline" : "secondary"}
              onClick={() => onChangeTab(ActiveTabKeys.DESKTOP)}
            >
              <Space>
                <IconFont iconName="icon-desktop" /> {t("desktop")}
              </Space>
            </Button>
            <Button
              style={{ paddingLeft: grid, paddingRight: grid }}
              type={isMobileActive ? "outline" : "secondary"}
              onClick={() => onChangeTab(ActiveTabKeys.MOBILE)}
            >
              <Space>
                <IconFont iconName="icon-mobile" /> {t("mobile")}
              </Space>
            </Button>
          </Button.Group>
        </div>
        <div style={{ position: "absolute", right: 0 }}>{props.right}</div>
      </div>
    </>
  );
};
