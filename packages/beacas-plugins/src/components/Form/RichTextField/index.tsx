import React, { ComponentProps, useEffect, useMemo } from "react";
import {
  BeacasEditor,
  BeacasEditorProvider,
  CustomSlateEditor,
  EmailTemplate,
} from "beacas-editor";
import "./RichTextField.scss";
import styleText from "@beacas-plugins/assets/font/iconfont.css?inline";
import { Node, createEditor } from "slate";
import { SharedComponents } from "@beacas-plugins/components";
import { enhancer } from "../enhancer";
import {
  BlockManager,
  Element,
  ElementType,
  NodeUtils,
  PageElement,
} from "beacas-core";
import { withTheme } from "@beacas-plugins/themes/Retro/withTheme";
import { cloneDeep, omit } from "lodash";
import { useEditorForm } from "@beacas-plugins/hooks";

const RichtextBar = (props: {
  value: Element;
  pageElement: PageElement;
  onChange: (val: Element) => void;
}) => {
  const editor = useMemo(() => createEditor(), []);
  const [initialValue, path] = useMemo(() => {
    const pageElement = cloneDeep(omit(props.pageElement, "children"));

    const template = {
      subject: "Blank",
      content: pageElement as PageElement,
    };
    let path: number[] = [];
    if (NodeUtils.isPageElement(props.value)) {
      template.content = props.value;
      path = [0];
    } else if (
      NodeUtils.isWrapperElement(props.value) ||
      NodeUtils.isSectionElement(props.value) ||
      NodeUtils.isHeroElement(props.value)
    ) {
      template.content = BlockManager.getBlockByType(ElementType.PAGE).create({
        ...pageElement,
        children: [props.value],
      });
      path = [0, 0];
    } else if (
      NodeUtils.isColumnElement(props.value) ||
      NodeUtils.isGroupElement(props.value)
    ) {
      template.content = BlockManager.getBlockByType(ElementType.PAGE).create({
        ...pageElement,
        children: [
          BlockManager.getBlockByType(ElementType.STANDARD_SECTION).create({
            children: [props.value],
            attributes: {
              "padding-bottom": "0px",
              "padding-left": "0px",
              "padding-right": "0px",
              "padding-top": "0px",
            },
          }),
        ],
      });
      path = [0, 0, 0];
    } else if (NodeUtils.isContentElement(props.value)) {
      template.content = BlockManager.getBlockByType(ElementType.PAGE).create({
        ...pageElement,
        children: [
          BlockManager.getBlockByType(ElementType.STANDARD_SECTION).create({
            children: [
              BlockManager.getBlockByType(
                ElementType.STANDARD_PARAGRAPH
              ).create({
                children: [props.value],
              }),
            ],
            attributes: {
              "padding-bottom": "0px",
              "padding-left": "0px",
              "padding-right": "0px",
              "padding-top": "0px",
            },
          }),
        ],
      });
      path = [0, 0, 0, 0];
    }

    return [template, path];
  }, [props.pageElement, props.value]);

  const onPageChange = (page: PageElement, editor: CustomSlateEditor) => {
    const currentElement = Node.get(editor, path) as Element;
    if (!currentElement) {
      console.error("Element not found");
      return;
    }

    props.onChange(currentElement);
  };

  return (
    <BeacasEditorProvider
      initialValues={initialValue}
      editor={editor}
      withEnhanceEditor={withTheme}
      onSubmit={() => {
        //
      }}
      onPageChange={onPageChange}
      newLineWithBr
    >
      <SharedComponents.HoveringToolbar />
      <BeacasEditor />
      <SharedComponents.Hotkeys />
      <ResetContent initialValue={initialValue} />
      <style>{styleText}</style>
    </BeacasEditorProvider>
  );
};

const ResetContent = ({ initialValue }: { initialValue: EmailTemplate }) => {
  const { reset } = useEditorForm();
  useEffect(() => {
    reset(initialValue);
  }, [initialValue, reset]);

  return <></>;
};

const DefaultRichTextField = enhancer(RichtextBar);

export const RichTextField = (
  props: ComponentProps<typeof DefaultRichTextField>
) => {
  return <DefaultRichTextField {...props} formItem={{ noStyle: true }} />;
};
