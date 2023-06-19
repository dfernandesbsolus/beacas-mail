import { EmailEditorProps } from "beacas-editor";
import React from "react";

import { createPortal } from "react-dom";
import { BlockManager, ElementCategory, NodeUtils } from "beacas-core";
import { ElementTools } from "../ElementTools";
import styleText from "./index.scss?inline";
import { BlockResizer } from "../BlockResizer";

export const ElementHover: NonNullable<EmailEditorProps["ElementHover"]> = (
  props
) => {
  const { element, nodeElement, path } = props;

  if (NodeUtils.isUnsetElement(element)) return null;

  const renderContent = (
    <>
      <ElementTools element={element} nodeElement={nodeElement} path={path} />
      <style>{styleText}</style>
    </>
  );

  const block = BlockManager.getBlockByType(element.type);

  if (NodeUtils.isButtonElement(element)) {
    return (
      <>
        {createPortal(<td>{renderContent}</td>, nodeElement)}
        <BlockResizer element={element} left right bottom horizontalScale={2} />
      </>
    );
  }

  if (NodeUtils.isImageElement(element)) {
    return (
      <>
        {createPortal(
          <>
            <td>{renderContent}</td>
          </>,
          nodeElement
        )}
        {element.attributes.src && (
          <BlockResizer element={element} left right horizontalScale={2} />
        )}
      </>
    );
  }
  if (block.category.includes(ElementCategory.DIVIDER)) {
    return (
      <>
        {createPortal(<td>{renderContent}</td>, nodeElement)}
        <BlockResizer element={element} left right horizontalScale={2} />;
      </>
    );
  }

  return <>{createPortal(renderContent, nodeElement)}</>;
};
