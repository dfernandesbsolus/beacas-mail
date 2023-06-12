import { Button, Space, Tabs, Tooltip } from "@arco-design/web-react";
import React, { useCallback, useMemo, useState } from "react";
import { IconDelete } from "@arco-design/web-react/icon";

import { BeacasCore, t } from "beacas-core";
import { IconFont } from "@beacas-plugins/components/IconFont";
import { get } from "lodash";
import { useEditorForm } from "@beacas-plugins/hooks";
import { AttributeField } from "../AttributeField";
import {
  ActiveTabKeys,
  useEditorProps,
  useEditorState,
  useSelectedNode,
} from "beacas-editor";
import { SourceCodePanel } from "../SourceCodePanel";

export { ResponsiveField } from "./ResponsiveField";

export const ResponsiveTabsContext = React.createContext<{
  activeTab: ActiveTabKeys;
}>({
  activeTab: ActiveTabKeys.DESKTOP,
});

export const ResponsiveTabs = ({
  mobile,
  desktop,
  children,
}: {
  mobile: React.ReactNode;
  desktop: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const enabledResponsive =
    BeacasCore.getFeatures().includes("responsive_view");
  const { activeTab, setActiveTab } = useEditorState();
  const { setFieldValue } = useEditorForm();
  const [count, setCount] = useState(0);
  const { selectedNode, selectedNodePath } = useSelectedNode();

  const { showSourceCode } = useEditorProps();

  // set Form FIELD

  const [selectedActiveTab, setSelectedActiveTab] = useState<string>(activeTab);

  const onRemoveAttribute = () => {
    const path = selectedNodePath;
    if (path) {
      setFieldValue(path, "mobileAttributes", {});
      setTimeout(() => {
        setCount((c) => c++); // force update
      }, 1000);
    }
  };
  const onChangTab = useCallback(
    (tab: any) => {
      if (tab === ActiveTabKeys.DESKTOP || tab === ActiveTabKeys.MOBILE) {
        setActiveTab(tab);
      }

      setSelectedActiveTab(tab);
    },
    [setActiveTab]
  );

  const attributes = selectedNode?.attributes;
  const mobileAttributes = selectedNode?.mobileAttributes;

  const hasMobileAttributes = useMemo(() => {
    return Object.keys(mobileAttributes || {}).some((key) => {
      return get(attributes, key) !== get(mobileAttributes, key);
    });
  }, [attributes, mobileAttributes]);

  return (
    <ResponsiveTabsContext.Provider
      value={{ activeTab: selectedActiveTab as ActiveTabKeys }}
    >
      <Tabs
        key={count}
        type="card-gutter"
        activeTab={selectedActiveTab}
        onChange={onChangTab}
      >
        <Tabs.TabPane
          title={
            <Space>
              <IconFont iconName="icon-desktop" />
              <span>
                {enabledResponsive ? t("Desktop") : t("Configuration")}
              </span>
            </Space>
          }
          key={ActiveTabKeys.DESKTOP}
        >
          {desktop}
          {children}
        </Tabs.TabPane>
        {enabledResponsive && (
          <Tabs.TabPane
            title={
              <Space>
                <IconFont iconName="icon-mobile" />
                <span>{t("Mobile")}</span>
                {hasMobileAttributes && (
                  <Tooltip content="Reset mobile attributes">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveAttribute();
                      }}
                      icon={<IconDelete />}
                      size="mini"
                    />
                  </Tooltip>
                )}
              </Space>
            }
            key={ActiveTabKeys.MOBILE}
          >
            <React.Fragment>
              {mobile}
              {children}
            </React.Fragment>
          </Tabs.TabPane>
        )}
        <Tabs.TabPane
          title={
            <Space>
              <IconFont iconName="icon-eye" />
              <span>{t("Display")}</span>
            </Space>
          }
          key="Display Options"
        >
          <AttributeField.DisplayOptions />
        </Tabs.TabPane>
        {showSourceCode && (
          <Tabs.TabPane
            destroyOnHide
            title={
              <Space>
                <span>{t("Source code")}</span>
              </Space>
            }
            key="Source code"
          >
            <SourceCodePanel />
          </Tabs.TabPane>
        )}
      </Tabs>
    </ResponsiveTabsContext.Provider>
  );
};
