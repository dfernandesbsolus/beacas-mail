import {
  useEditorProps,
  useEditorState,
  useEventCallback,
} from "beacas-editor";
import React from "react";
import styleText from "./index.scss?inline";
import { IconFont } from "@beacas-plugins/components/IconFont";
import { useDragging, useElementInteract } from "@beacas-plugins/hooks";
import { createPortal } from "react-dom";
import { ReactEditor, useSlate } from "slate-react";
import {
  NodeUtils,
  Element,
  BlockManager,
  ElementCategory,
  classnames,
  PageElement,
} from "beacas-core";
import { Path } from "slate";
import { useUniversalContent } from "@beacas-plugins/hooks/useUniversalContent";
import { get } from "lodash";

export const ElementTools: React.FC<{
  element: Element;
  nodeElement: HTMLElement;
  path: Path;
}> = ({ element, nodeElement, path }) => {
  const editor = useSlate();

  const { copyBlock, deleteBlock } = useElementInteract();
  const { universalElementSetting, quantityLimitCheck } = useEditorProps();

  const { open } = useUniversalContent();
  const { setSelectedNodePath, universalElementEditing, universalElementPath } =
    useEditorState();

  const { dragHandle } = useDragging({
    element: element,
    nodeElement,
    action: "move",
    cloneGhost: true,
  });

  const openModal: React.DOMAttributes<HTMLDivElement>["onPointerDown"] = (
    ev
  ) => {
    ev.preventDefault();
    ev.stopPropagation();
    open(element);
    setSelectedNodePath(ReactEditor.findPath(editor, element));
  };

  const onCopy: React.DOMAttributes<HTMLDivElement>["onPointerDown"] =
    useEventCallback((ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (
        quantityLimitCheck &&
        !quantityLimitCheck({
          element: element,
          pageData: editor.children[0] as PageElement,
        })
      ) {
        return;
      }

      const path = ReactEditor.findPath(editor, element);
      copyBlock(path);
    });

  const onDelete: React.DOMAttributes<HTMLDivElement>["onPointerDown"] =
    useEventCallback((ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const path = ReactEditor.findPath(editor, element);
      deleteBlock(path);
    });

  const isSectionCategory = BlockManager.getBlockByType(
    element.type
  ).category.includes(ElementCategory.SECTION);

  const isWrapperCategory = BlockManager.getBlockByType(
    element.type
  ).category.includes(ElementCategory.WRAPPER);

  const isFullWidth = get(element, "attributes.full-width") === "full-width";

  const isTopEnough = nodeElement.getBoundingClientRect().top >= 30;

  const isUniversalElement = NodeUtils.isUniversalElement(element);
  const isEditingUniversalElement =
    universalElementPath &&
    Path.equals(universalElementPath, path) &&
    universalElementEditing;

  const renderContent = (
    <>
      <div
        contentEditable={false}
        className="element-tools-container"
        data-is-section-category={isSectionCategory}
        data-is-wrapper-category={isWrapperCategory}
        data-is-full-width={isFullWidth}
      >
        <div
          className={classnames(
            "element-tools",
            !isTopEnough && "element-tools-bottom"
          )}
        >
          <div
            {...(isEditingUniversalElement ? {} : dragHandle)}
            style={{
              cursor: isEditingUniversalElement ? "default" : "grab",
              display: "flex",
            }}
          >
            {isUniversalElement && (
              <IconFont
                iconName="icon-start"
                style={{ fontSize: 12, marginRight: 2 }}
              />
            )}
            {BlockManager.getBlockTitle(element)}
          </div>
          {!isEditingUniversalElement && (
            <div className="element-tools-item" onPointerDown={onCopy}>
              <IconFont iconName="icon-copy" />
            </div>
          )}
          {universalElementSetting &&
            !universalElementEditing &&
            !isUniversalElement && (
              <div className="element-tools-item" onPointerDown={openModal}>
                <IconFont iconName="icon-collection" />
              </div>
            )}
          {!isEditingUniversalElement && (
            <div className="element-tools-item" onPointerDown={onDelete}>
              <IconFont iconName="icon-delete" />
            </div>
          )}
        </div>
      </div>

      <div className="element-dragover" />

      <style>{styleText}</style>
    </>
  );
  const isContentElement = NodeUtils.isContentElement(element);

  return (
    <>
      {createPortal(
        isContentElement ? (
          <>
            <td>{renderContent}</td>
          </>
        ) : (
          renderContent
        ),
        nodeElement
      )}
    </>
  );
};
