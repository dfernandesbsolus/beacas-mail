import { BlockSideBar } from "./BlockSideBar";
import { ColumnLayout } from "./ColumnLayout";
import { ConfigurationDrawer } from "./ConfigurationDrawer";

import { ConfigurationPanel } from "./ConfigurationPanel";
import { Controller } from "./Controller";
import { EditorTabs } from "./EditorTabs";
import { Hotkeys } from "./Hotkeys";
import { UniversalElementEditorDrawer } from "./UniversalElementEditorDrawer";
import { PreviewEmail } from "./EditorTabs/components/PreviewEmail";
import { PreviewEmailDrawer } from "./EditorTabs/components/PreviewEmailDrawer";
import { FullHeightOverlayScrollbars } from "./FullHeightOverlayScrollbars";
import { HoveringToolbar } from "./HoveringToolbar";
import { RichTextBar } from "./HoveringToolbar/RichTextBar";

export * from "./Providers";

export const SharedComponents = {
  PreviewEmailDrawer: PreviewEmailDrawer,
  PreviewEmail: PreviewEmail,
  BlockSideBar: BlockSideBar,
  ColumnLayout: ColumnLayout,
  ConfigurationDrawer: ConfigurationDrawer,
  ConfigurationPanel: ConfigurationPanel,
  EditorTabs: EditorTabs,
  UniversalElementEditorDrawer: UniversalElementEditorDrawer,
  RichTextBar: RichTextBar,
  HoveringToolbar: HoveringToolbar,
  Hotkeys: Hotkeys,
  Controller: Controller,
  FullHeightOverlayScrollbars: FullHeightOverlayScrollbars,
};

export { CollapseWrapper } from "./ConfigurationPanel/components/CollapseWrapper";
export { AttributesPanelWrapper } from "./ConfigurationPanel/components/AttributesPanelWrapper";
export { AttributeField } from "./ConfigurationPanel/components/AttributeField";
export { ConfigPanelsMap } from "./ConfigurationPanel/Elements";

export {
  ResponsiveField,
  ResponsiveTabs,
} from "./ConfigurationPanel/components/ResponsiveTabs";

export { IconFont } from "./IconFont";
