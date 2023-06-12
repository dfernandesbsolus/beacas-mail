import { MergetagItem } from "@beacas-editor/components/BeacasEditorProvider";
import { TextFormat } from "@beacas-editor/constants";
import type {
  Element,
  ExtendedType,
  MergetagElement,
  PageElement,
} from "beacas-core";
import { BaseSelection, Path } from "slate";
import { EditableProps } from "slate-react/dist/components/editable";
import { CustomSlateEditor } from "./custom-types";

export * from "./custom-types";

export interface CustomEditorTypes {
  [key: string]: unknown;
}

export interface BasicEmailTemplate {
  content: PageElement;
  subject: string;
}

export interface BasicEditorProps
  extends Partial<Pick<EditableProps, "onDOMBeforeInput" | "onKeyDown">> {
  onUpload?: (blob: Blob) => Promise<string>;
  onSubmit: (values: EmailTemplate) => void;
  onPageChange?: (
    content: EmailTemplate["content"],
    editor: CustomSlateEditor
  ) => void;
  fontList?: {
    value: string;
    label: string;
  }[];
  fontSizeList?: string[];
  localeData?: Record<string, string>;
  initialValues: EmailTemplate;
  children: React.ReactNode;
  loading?: React.ReactNode;
  editor: CustomSlateEditor;
  footer?: React.ReactNode;
  ElementPlaceholder?: React.FC<{
    element: Element;
    isSelected: boolean;
    isHover: boolean;
    nodeElement: HTMLElement;
    path: Path;
  }>;
  ElementHover?: React.FC<{
    element: Element;
    isSelected: boolean;
    nodeElement: HTMLElement;
    path: Path;
  }>;
  ElementSelected?: React.FC<{
    element: Element;
    isHover: boolean;
    nodeElement: HTMLElement;
    path: Path;
  }>;
  MergetagPopover?: React.FC<{
    element: MergetagElement;
    onSave: (val?: string) => void;
  }>;
  interactiveStyle?: {
    hoverColor?: string;
    selectedColor?: string;
    dragColor?: string;
  };
  withEnhanceEditor?: (
    editor: CustomSlateEditor,
    props: EmailEditorProps
  ) => CustomSlateEditor;
  hoveringToolbar?: {
    prefix?: React.ReactNode;
    list?: (params: {
      isCollapsed?: boolean;
      selection: BaseSelection;
    }) => Array<TextFormat>;
    subfix?: React.ReactNode;
  };
  mergetags?: MergetagItem[];
  mergetagsData?: Record<string, any>;
  newLineWithBr?: boolean;
  universalElementSetting?: {
    elements: Record<string, Element>;
  };
  readOnly?: boolean;
}

export type EmailTemplate = ExtendedType<
  "EmailTemplate",
  BasicEmailTemplate,
  CustomEditorTypes
>;

export type EmailEditorProps = ExtendedType<
  "EmailEditorProps",
  BasicEditorProps,
  CustomEditorTypes
>;
