import { useCallback, useMemo } from "react";

import React from "react";
import { Button, Divider, Drawer, Layout, Space } from "@arco-design/web-react";
import { IconSubscribeAdd } from "@arco-design/web-react/icon";
import { TabHeader } from "../TabHeader";

import { observer } from "mobx-react";
import { BeacasCore, t } from "beacas-core";
import {
  ActiveTabKeys,
  useEditorContext,
  useEditorProps,
  useEditorState,
  useEventCallback,
} from "beacas-editor";
import { VariablesEditorField } from "@beacas-plugins/components/Form/VariablesEditor";
import { store } from "@beacas-plugins/store";
import { SharedComponents } from "@beacas-plugins/components";

export const PreviewEmailDrawer = observer(
  ({ children }: { children: React.ReactNode }) => {
    const { isPreview } = store.editorState.state;
    const { activeTab } = useEditorState();
    const [isShowSidebar, setIsShowSidebar] = React.useState(false);
    const { values, mergetagsData } = useEditorContext();
    const { universalElementSetting } = useEditorProps();

    const subject = useMemo(() => {
      try {
        return BeacasCore.renderWithData(values.subject, mergetagsData || {});
      } catch (error: any) {
        console.error(error?.message || error);
        return values.subject;
      }
    }, [values.subject, mergetagsData]);

    const onToggleVisible = useCallback(() => {
      store.editorState.setIsPreview(!isPreview);
    }, [isPreview]);

    const onToggleShowSidebar = useEventCallback(() => {
      setIsShowSidebar((v) => !v);
    });

    return useMemo(() => {
      return (
        <div>
          <div onClick={onToggleVisible}>{children}</div>

          <Drawer
            bodyStyle={{ padding: 0, overflow: "hidden" }}
            title={null}
            width="100vw"
            height="100vh"
            visible={isPreview}
            placement="right"
            onCancel={onToggleVisible}
            closable={false}
            footer={null}
          >
            <div
              style={{
                width: "100vw",
                height: 65,
                display: "flex",
                alignItems: "center",
              }}
            >
              <TabHeader
                left={
                  <Space size="large">
                    <div />
                    <span style={{ fontSize: 16, fontWeight: "500" }}>
                      {t("Preview Mode")}
                    </span>
                  </Space>
                }
                right={
                  <Space size="large">
                    <Button type="outline" onClick={onToggleShowSidebar}>
                      {t("Edit test variables")}
                    </Button>
                    <Button type="primary" onClick={onToggleVisible}>
                      {t("Done")}
                    </Button>
                    <div />
                  </Space>
                }
              />
            </div>
            <Divider style={{ padding: 0, margin: 0 }} />
            <Layout>
              <Layout.Content
                style={{ height: "calc(100vh - 60px)", overflow: "hidden" }}
              >
                <p
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "15px 24px",
                    boxSizing: "border-box",
                    borderBottom:
                      "1px solid var(--color-neutral-3, rgb(229, 230, 235))",
                    position: "sticky",
                    fontSize: 16,
                    color: "#222222",
                    margin: 0,
                  }}
                >
                  <span style={{ color: "#666" }}>
                    <IconSubscribeAdd /> &nbsp;
                    <span>{t("Subject")}: &emsp;</span>
                  </span>
                  <span>{subject}</span>
                </p>
                <div style={{ height: "calc(100vh - 120px)" }}>
                  {isPreview && (
                    <SharedComponents.PreviewEmail
                      isDesktop={activeTab === ActiveTabKeys.DESKTOP}
                      universalElementSetting={universalElementSetting}
                      values={values}
                      mergetagsData={mergetagsData}
                    />
                  )}
                </div>
              </Layout.Content>
              <Layout.Sider
                width={550}
                collapsed={!isShowSidebar}
                collapsible
                trigger={null}
                collapsedWidth={0}
              >
                <SharedComponents.FullHeightOverlayScrollbars
                  height={"calc(100vh - 60px)"}
                >
                  {isShowSidebar && <VariablesEditorField />}
                </SharedComponents.FullHeightOverlayScrollbars>
              </Layout.Sider>
            </Layout>
          </Drawer>
        </div>
      );
    }, [
      onToggleVisible,
      children,
      isPreview,
      onToggleShowSidebar,
      subject,
      activeTab,
      universalElementSetting,
      values,
      mergetagsData,
      isShowSidebar,
    ]);
  }
);
