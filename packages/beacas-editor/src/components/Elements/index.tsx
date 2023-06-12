import React, { useMemo, useRef } from "react";
import { Editor } from "slate";
import { RenderElementProps, useSlate } from "slate-react";
import {
  Social,
  SocialItem,
  NavbarLink,
  Page,
  Spacer,
  Navbar,
  Raw,
} from "./atom";

import { Image } from "./basic/Image";
import { Button } from "./basic/Button";
import { Hero } from "./basic/Hero";

import { Group } from "./basic/Group";
import { Column } from "./basic/Column";
import { Section } from "./basic/Section";
import { Divider } from "./basic/Divider";
import { Text as TextComponent } from "./basic/Text";
import {
  mergeBlock,
  Element,
  BeacasCore,
  PageElement,
  BlockManager,
  NodeUtils,
  CONTENT_EDITABLE_CLASSNAME,
  ElementType,
} from "beacas-core";

import { Leaf } from "../Leaf";
import { CustomSlateEditor } from "@beacas-editor/typings/custom-types";
import { TextList } from "./basic/TextList";
import { TextListItem } from "./basic/TextList/TextListItem";
import { BaseElementProps } from "./BaseElement";
import { Mergetag } from "./atom/Mergetag";
import { useEditorState } from "@beacas-editor/hooks/useEditorState";
import { ActiveTabKeys } from "@beacas-editor/contexts";
import { LineBreak } from "./atom/LineBreak";
import { Placeholder } from "./atom/Placeholder";
import { HtmlNode } from "./atom/HtmlNode";
import { useEditorProps } from "@beacas-editor/hooks";
import { Wrapper } from "./atom/Wrapper";

const componentMap: Record<string, any> = {
  wrapper: Wrapper,
  section: Section,
  column: Column,
  text: TextComponent,
  button: Button,
  social: Social,
  spacer: Spacer,
  group: Group,
  image: Image,
  hero: Hero,
  raw: Raw,
  divider: Divider,
  "social-element": SocialItem,
  navbar: Navbar,
  "navbar-link": NavbarLink,

  //------
  page: Page,
  [ElementType.MERGETAG]: Mergetag,
  [ElementType.LINE_BREAK]: LineBreak,
  [ElementType.PLACEHOLDER]: Placeholder,
  [ElementType.HTML_NODE]: HtmlNode,
  [ElementType.STANDARD_TEXT_LIST]: TextList,
  [ElementType.STANDARD_TEXT_LIST_ITEM]: TextListItem,
};

export type ElementProps = Omit<
  RenderElementProps,
  "attributes" | "element"
> & {
  attributes?: RenderElementProps["attributes"] & {
    contentEditable?: boolean;
  };
  placeholder?: React.ReactNode;
  element: Element;
};

export const ElementComponent = (props: ElementProps) => {
  const { activeTab } = useEditorState();
  const isMobileActive = activeTab === ActiveTabKeys.MOBILE;
  const { mergetagsData } = useEditorProps();
  return useMemo(() => {
    const { element } = props;
    if (element.visible === "desktop" && isMobileActive) return null;
    if (element.visible === "mobile" && !isMobileActive) return null;
    return (
      <ElementComponentContent
        {...props}
        mergetagsData={mergetagsData}
        isMobileActive={isMobileActive}
      />
    );
  }, [props, isMobileActive, mergetagsData]);
};

const ElementComponentContent: React.FC<
  ElementProps & {
    isMobileActive: boolean;
    mergetagsData?: Record<string, any>;
  }
> = (props) => {
  const { element, isMobileActive } = props;
  const Com = componentMap[element.type];

  const editor = useSlate();

  const pageElement = Editor.node(editor, [0])[0] as PageElement;

  if (!pageElement.data.breakpoint) {
    pageElement.data.breakpoint = "600px";
  }
  const enabledResponsive =
    BeacasCore.getFeatures().includes("responsive_view");
  const attributes =
    isMobileActive && enabledResponsive
      ? mergeBlock(element.attributes, element.mobileAttributes)
      : element.attributes;

  const context = {
    ...pageElement,

    data: {
      ...pageElement.data,
      breakpoint: isMobileActive ? "99999px" : pageElement.data.breakpoint,
    },
    attributes: {
      ...pageElement.attributes,
      width: isMobileActive ? "375px" : pageElement.attributes.width || "600px",
    },
  };

  if (!Com) {
    const mjmlString = BeacasCore.elementToMjml(
      {
        ...element,
        attributes: attributes as any,
      },
      {
        pageElement: pageElement,
        mode: "testing",
        keepEmptyAttributes: true,
        mergetagsData: props.mergetagsData,
        displayMode: isMobileActive ? "only-mobile" : "only-desktop",
      }
    );

    const customElement = BeacasCore.mjmlToBlockElement(mjmlString);

    if (NodeUtils.isTextNode(customElement)) {
      return null;
    }

    return (
      <RenderBasicElement
        {...props}
        element={element}
        atomElement={customElement}
        editor={editor}
        elementAttributes={customElement.attributes}
        context={context}
        isMobileActive={isMobileActive}
      />
    );
  }

  return (
    <>
      <Com
        {...props}
        elementType={element.type}
        elementAttributes={attributes}
        editor={editor}
        context={context}
        isMobileActive={isMobileActive}
      />
    </>
  );
};

function RenderBasicElement({
  context,
  editor,
  elementAttributes,
  ...rest
}: ElementProps & {
  context: BaseElementProps<any>["context"];
  atomElement: Element;
  editor: CustomSlateEditor;
  elementAttributes: any;
  isMobileActive: boolean;
}) {
  const { element, atomElement, attributes } = rest;
  const Com = componentMap[atomElement.type];

  if (!Com) {
    throw new Error("Invalid Com");
  }
  const block = BlockManager.getBlockByType(element.type);

  return block.void ? (
    <React.Fragment>
      <VoidElementRender
        attributes={attributes}
        atomElement={atomElement}
        context={context}
        children={rest.children}
        placeholder={rest.placeholder}
        isMobileActive={rest.isMobileActive}
      />
    </React.Fragment>
  ) : (
    <Com
      {...rest}
      attributes={attributes}
      context={context}
      element={element}
      elementAttributes={elementAttributes}
      editor={editor}
    >
      {rest.children}
    </Com>
  );
}

const VoidElementRender = ({
  context,
  children,
  attributes,
  atomElement,
  placeholder,
  isMobileActive,
}: {
  context: BaseElementProps<any>["context"];
  children: React.ReactNode;
  attributes: any;
  atomElement: Element;
  placeholder?: React.ReactNode;
  isMobileActive: boolean;
}) => {
  const indexRef = useRef(0);
  indexRef.current = 0;

  return (
    <ElementRender
      attributes={attributes}
      element={atomElement}
      context={context}
      children={children}
      indexRef={indexRef}
      placeholder={placeholder}
      isMobileActive={isMobileActive}
    />
  );
};
function ElementRender({
  element,
  context,
  children,
  attributes,
  indexRef,
  placeholder,
  isMobileActive,
}: {
  element: Element;
  context: BaseElementProps<any>["context"];
  children: React.ReactNode;
  attributes: any;
  indexRef: { current: number };
  placeholder?: React.ReactNode;
  isMobileActive: boolean;
}) {
  const Com = componentMap[element.type];
  const editor = useSlate();

  return (
    <Com
      element={element}
      elementType={element.type}
      elementAttributes={element.attributes}
      editor={editor}
      context={context}
      attributes={attributes}
      placeholder={placeholder}
    >
      {element.children.map((item, index) => {
        if (
          NodeUtils.isBlockElement(item) &&
          NodeUtils.isContentElement(item)
        ) {
          const isEditableTextNode = item.attributes["css-class"]?.includes(
            CONTENT_EDITABLE_CLASSNAME
          );
          if (isEditableTextNode) {
            const child = Array.isArray(children)
              ? children?.[indexRef.current++]
              : children;

            return <React.Fragment key={index}>{child}</React.Fragment>;
          }
        }

        if (NodeUtils.isTextNode(item)) {
          return (
            <Leaf key={index} leaf={item} text={item} contentUneditable>
              {item.text}
            </Leaf>
          );
        }
        return (
          <React.Fragment key={index}>
            <ElementRender
              attributes={{}}
              element={item}
              context={context}
              children={children}
              indexRef={indexRef}
              isMobileActive={isMobileActive}
            />
          </React.Fragment>
        );
      })}
    </Com>
  );
}
