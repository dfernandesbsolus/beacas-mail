import {
  BeacasEditor,
  CustomSlateEditor,
  useEditorContext,
  useEditorProps,
} from "beacas-editor";
import { useSlate } from "slate-react";
import { EmailEditorProps } from "beacas-editor";
import React, { useEffect, useMemo } from "react";

import { ReactEditor } from "slate-react";
import { BlockMenusOverlay } from "./components/BlockMenusOverlay";
import { ElementHover } from "./components/ElementHover";
import styleText from "@beacas-plugins/assets/font/iconfont.css?inline";
import minimaliststyleText from "./Minimalist.scss?inline";
import { withTheme } from "./withTheme";
import { ElementSelected } from "./components/ElementSelected";
import { MergetagPopover } from "@beacas-plugins/components/MergetagPopover";
import { store } from "../../store";
import { ColumnLayoutOverlay } from "@beacas-plugins/themes/Minimalist/components/ColumnLayoutOverlay";
import { PluginsProvider } from "@beacas-plugins/components/Providers";
import { SharedComponents } from "@beacas-plugins/components";
import { ThemeConfigProps } from "@beacas-plugins/typings";
import { createEditor } from "slate";
import FullScreenLoading from "@beacas-plugins/components/FullScreenLoading";
import { Card, Layout as ArcoLayout } from "@arco-design/web-react";
import { AutoSelectElement } from "./components/AutoSelectElement";
import { ElementPlaceholder } from "./components/ElementPlaceholder";

const useCreateConfig = ({
  interactiveStyle,
  hoveringToolbar,
  ...rest
}: Omit<ThemeConfigProps, "editor">): Omit<EmailEditorProps, "children"> &
  Omit<EmailEditorProps, "children"> => {
  const editor = useMemo(() => createEditor(), []) as CustomSlateEditor;
  return {
    editor: editor,
    withEnhanceEditor: withTheme,
    ElementPlaceholder: ElementPlaceholder,
    ElementHover: ElementHover,
    ElementSelected: ElementSelected,
    MergetagPopover: MergetagPopover,
    interactiveStyle,
    hoveringToolbar,
    newLineWithBr: false,
    loading: <FullScreenLoading isFullScreen />,
    ...rest,
  };
};

const Layout: React.FC<{ children?: React.ReactNode; height: string }> = ({
  children,
  height,
}) => {
  const { inited } = useEditorContext();
  const { controller = true, showSidebar = false } = useEditorProps();

  const editor = useSlate();

  const getRoot = () => {
    try {
      return ReactEditor.getWindow(editor).document;
    } catch (error) {
      return null;
    }
  };
  const root = getRoot();

  useEffect(() => {
    const handleDOMClick = () => {
      store.ui.setBlockMenusOverlayVisible(false);
    };
    window.addEventListener("click", handleDOMClick, true);
    return () => {
      window.removeEventListener("click", handleDOMClick, true);
    };
  }, []);

  const layoutContent = (
    <SharedComponents.UniversalElementEditorDrawer>
      <Card
        style={{ padding: 0 }}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
      >
        <ArcoLayout
          style={{
            display: "flex",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {showSidebar && (
            <ArcoLayout.Sider
              style={{
                minWidth: 300,
                maxWidth: 400,
                width: 400,
                position: "relative",
                zIndex: 1,
              }}
            >
              <SharedComponents.BlockSideBar height={height} />
            </ArcoLayout.Sider>
          )}
          <div
            style={{
              height: height,
              maxWidth: "100%",
              flex: showSidebar ? 1 : undefined,
            }}
          >
            <SharedComponents.EditorTabs>
              <BeacasEditor>
                <style id="Retro-CSS">
                  {styleText}
                  {minimaliststyleText}
                </style>
              </BeacasEditor>

              {children}
            </SharedComponents.EditorTabs>
          </div>
        </ArcoLayout>
      </Card>
    </SharedComponents.UniversalElementEditorDrawer>
  );
  if (!root || !inited)
    return <PluginsProvider>{layoutContent}</PluginsProvider>;

  return (
    <PluginsProvider>
      {layoutContent}
      <SharedComponents.HoveringToolbar />
      {controller && <SharedComponents.Controller />}
      <SharedComponents.Hotkeys />
      <ColumnLayoutOverlay />
      <BlockMenusOverlay />
      <AutoSelectElement />
      <style>{styleText} </style>
    </PluginsProvider>
  );
};

export const Minimalist = { useCreateConfig, Layout };
