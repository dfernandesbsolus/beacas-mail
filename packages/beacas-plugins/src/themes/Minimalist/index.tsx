import {
  CustomSlateEditor,
  TextFormat,
  toggleFormat,
  useEditorContext,
} from "beacas-editor";
import { useSlate } from "slate-react";
import { EmailEditorProps } from "beacas-editor";
import React, { useEffect } from "react";

import { ReactEditor } from "slate-react";
import { MoreActionsMenusOverlay } from "./components/MoreActionsMenusOverlay";
import { BlockMenusOverlay } from "./components/BlockMenusOverlay";
import { ElementHover } from "./components/ElementHover";
import styleText from "@beacas-plugins/assets/font/iconfont.css?inline";
import minimaliststyleText from "./Minimalist.scss?inline";
import { createPortal } from "react-dom";
import { withTheme } from "./withTheme";
import { ElementSelected } from "./components/ElementSelected";
import { MergetagPopover } from "@beacas-plugins/components/MergetagPopover";
import { store } from "../../store";
import { ColumnLayoutOverlay } from "@beacas-plugins/themes/Minimalist/components/ColumnLayoutOverlay";
import { PluginsProvider } from "@beacas-plugins/components/Providers";
import { SharedComponents } from "@beacas-plugins/components";
const createConfig = ({
  editor,
  interactiveStyle,
  hoveringToolbar,
  ...rest
}: {
  editor: CustomSlateEditor;
} & Omit<EmailEditorProps, "children">): Omit<EmailEditorProps, "children"> & {
  editor: CustomSlateEditor;
} => {
  const onDOMBeforeInput = (event: InputEvent) => {
    switch (event.inputType) {
      case "formatBold":
        event.preventDefault();
        return toggleFormat(editor, TextFormat.BOLD);
      case "formatItalic":
        event.preventDefault();
        return toggleFormat(editor, TextFormat.ITALIC);
      case "formatUnderline":
        event.preventDefault();
        return toggleFormat(editor, TextFormat.UNDERLINE);
    }
  };

  return {
    ...rest,
    onDOMBeforeInput,
    editor: editor,
    withEnhanceEditor: withTheme,
    ElementHover: ElementHover,
    ElementSelected: ElementSelected,
    MergetagPopover,
    interactiveStyle,
    hoveringToolbar,
  };
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const editor = useSlate();
  const { inited } = useEditorContext();

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

  if (!root || !inited) return <>{children}</>;

  return (
    <PluginsProvider>
      {children}
      <SharedComponents.HoveringToolbar />
      <MoreActionsMenusOverlay />
      <BlockMenusOverlay />
      <ColumnLayoutOverlay />

      {createPortal(
        <style>
          {styleText}
          {minimaliststyleText}
        </style>,
        root.body
      )}
      <style>{styleText}</style>
    </PluginsProvider>
  );
};

export const Minimalist = { createConfig, Layout };
