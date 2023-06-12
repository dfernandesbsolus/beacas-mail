import { defaultAttributeFields } from "@beacas-plugins/components/ConfigurationPanel/components/AttributeField";
import type {
  Element,
  ElementMap,
  ExtendedType,
  PageElement,
  PickObjectValueByKey,
} from "beacas-core";
import type {
  BasicEditorProps,
  BasicEmailTemplate,
  EmailEditorProps,
} from "beacas-editor";
import React from "react";
import { Path } from "slate";

export type ThemeConfigProps = Omit<EmailEditorProps, "children">;

export interface CustomThemeTypes {
  [key: string]: unknown;
}

export type BasicConfigPanelsMap = {
  [K in PickObjectValueByKey<Element, "type">]: React.FC<{ nodePath: Path }>;
};

export type BasicAttributeFieldsMap = typeof defaultAttributeFields;

export type AttributeFieldsMap = ExtendedType<
  "AttributeFieldsMap",
  BasicAttributeFieldsMap,
  CustomThemeTypes
>;

export interface CategoryGridItem<T extends keyof ElementMap = any> {
  label: string;
  active?: boolean;
  blocks: Array<{
    type: Element["type"];
    payload?: Partial<ElementMap[T]>;
    title?: string | undefined;
    icon?: React.ReactNode;
  }>;
  displayType?: "grid";
}

export type Categories = Array<
  | CategoryGridItem
  | {
      label: string;
      active?: boolean;
      blocks: Array<{
        payload: string[][];
        title: string | undefined;
      }>;
      displayType: "column";
    }
  | {
      label: string;
      active?: boolean;
      blocks: Array<{
        payload?: Partial<Element>;
      }>;
      displayType: "widget";
    }
  | {
      label: string;
      active?: boolean;
      blocks: Array<React.ReactNode>;
      displayType: "custom";
    }
>;

export interface PluginsCustomEditorTypes {
  AttributeFieldsMap?: AttributeFieldsMap;

  EmailEditorProps: BasicEditorProps & {
    categories?: Categories;
    attributeFields?: AttributeFieldsMap;
    showSourceCode?: boolean;
    universalElementSetting?: {
      elements: Record<string, Element>;
      list: Array<{
        label: string;
        elements: Array<{
          element: Element;
          thumbnail: string;
        }>;
      }>;
      onAddElement: (params: {
        name: string;
        element: Element;
        thumbnail: Blob;
      }) => Promise<Element>;

      onUpdateElement: (params: {
        uid: string;
        element: Element;
        thumbnail: Blob;
      }) => Promise<any>;
    };
    quantityLimitCheck?: (params: {
      element: Element;
      pageData: PageElement;
    }) => boolean;
    controller?: boolean;
    showPreview?: boolean;
    showSidebar?: boolean;
  };

  EmailTemplate: BasicEmailTemplate;
}

declare module "beacas-editor" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomEditorTypes extends PluginsCustomEditorTypes {}
}
