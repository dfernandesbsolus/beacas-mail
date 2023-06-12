import {
  BeacasEditor,
  CustomSlateEditor,
  EmailEditorProps,
  useEditorContext,
  useEditorProps,
} from "beacas-editor";
import { useSlate } from "slate-react";
import React, { useMemo } from "react";

import { ReactEditor } from "slate-react";

import styleText from "@beacas-plugins/assets/font/iconfont.css?inline";
import RetroStyleText from "./Retro.scss?inline";
import { withTheme } from "./withTheme";
import {
  ElementHover,
  ElementSelected,
  ElementPlaceholder,
} from "./components/ElementInteract";
import { MergetagPopover } from "@beacas-plugins/components/MergetagPopover";
import { Card, Layout as ArcoLayout } from "@arco-design/web-react";
import { PluginsProvider } from "@beacas-plugins/components/Providers";
import { SharedComponents } from "@beacas-plugins/components";
import FullScreenLoading from "@beacas-plugins/components/FullScreenLoading";
import { ThemeConfigProps } from "@beacas-plugins/typings";
import { createEditor } from "slate";

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
    newLineWithBr: true,
    loading: <FullScreenLoading isFullScreen />,
    ...rest,
  };
};

const Layout: React.FC<{ children?: React.ReactNode; height: string }> = ({
  children,
  height,
}) => {
  const { inited } = useEditorContext();
  const { controller = true, showSidebar = true } = useEditorProps();

  const editor = useSlate();

  const getRoot = () => {
    try {
      return ReactEditor.getWindow(editor).document;
    } catch (error) {
      return null;
    }
  };
  const root = getRoot();

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
          <div style={{ height: height, minWidth: 600, flex: 1 }}>
            <SharedComponents.EditorTabs>
              <BeacasEditor>
                <style id="Retro-CSS">
                  {styleText}
                  {RetroStyleText}
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
      <style>{styleText}</style>
    </PluginsProvider>
  );
};

export const Retro = { useCreateConfig, Layout };
