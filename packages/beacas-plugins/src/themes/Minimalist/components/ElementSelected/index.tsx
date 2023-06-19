import { EmailEditorProps } from "beacas-editor";

import { observer } from "mobx-react";
import React from "react";
import styleText from "./index.scss?inline";
import { createPortal } from "react-dom";
import { BlockResizer } from "../BlockResizer";
import { BlockManager, ElementCategory, NodeUtils } from "beacas-core";

export const ElementSelected: NonNullable<EmailEditorProps["ElementSelected"]> =
  observer(({ element, nodeElement }) => {
    const renderContent = (
      <>
        <style>{styleText}</style>
      </>
    );

    const block = BlockManager.getBlockByType(element.type);

    if (block.category.includes(ElementCategory.BUTTON)) {
      return (
        <>
          {createPortal(<td>{renderContent}</td>, nodeElement)}
          <BlockResizer
            element={element}
            left
            right
            bottom
            horizontalScale={2}
          />
        </>
      );
    }

    if (NodeUtils.isImageElement(element)) {
      return (
        <>
          {createPortal(<td>{renderContent}</td>, nodeElement)}
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

    return <>{renderContent}</>;
  });
