import { EmailEditorProps } from "beacas-editor";
import React from "react";

import { createPortal } from "react-dom";
import { NodeUtils } from "beacas-core";
import { ElementTools } from "../ElementTools";
import styleText from "./index.scss?inline";

export const ElementSelected: NonNullable<
  EmailEditorProps["ElementSelected"]
> = ({ element, nodeElement, path }) => {
  if (NodeUtils.isUnsetElement(element)) return null;

  const renderContent = (
    <>
      <ElementTools element={element} nodeElement={nodeElement} path={path} />
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
