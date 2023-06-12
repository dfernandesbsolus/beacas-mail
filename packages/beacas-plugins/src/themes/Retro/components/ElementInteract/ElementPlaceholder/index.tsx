import { EmailEditorProps } from "beacas-editor";
import React from "react";

import { createPortal } from "react-dom";
import { ElementType, NodeUtils, t } from "beacas-core";
import { IconDelete } from "@arco-design/web-react/icon";
import { Path } from "slate";
import styleText from "./index.scss?inline";
import { get } from "lodash";
import { useElementInteract } from "@beacas-plugins/hooks";

export const ElementPlaceholder: NonNullable<
  EmailEditorProps["ElementPlaceholder"]
> = ({ element, nodeElement, isSelected, isHover, path }) => {
  const { deleteBlock } = useElementInteract();

  const onPointerDown: React.DOMAttributes<SVGElement>["onPointerDown"] = (
    ev
  ) => {
    ev.preventDefault();
    ev.stopPropagation();

    deleteBlock(Path.parent(path));
  };

  const isSectionCategory = NodeUtils.isSectionElement(element);
  const isWrapperCategory = NodeUtils.isWrapperElement(element);

  let renderContent = null;
  if (isSectionCategory) {
    const isFullWidth = get(element.attributes, "full-width") == "full-width";
    renderContent = (
      <>
        <div
          data-is-full-width={isFullWidth}
          className="section-category-hover"
        ></div>
      </>
    );
  } else if (isWrapperCategory) {
    const isFullWidth = get(element.attributes, "full-width") == "full-width";
    renderContent = (
      <>
        {isFullWidth ? (
          <tbody>
            <tr>
              <td>
                <div
                  data-is-full-width={isFullWidth}
                  className="wrapper-category-hover"
                ></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <div className="wrapper-category-hover"></div>
        )}
      </>
    );
  } else if (element.type === ElementType.PLACEHOLDER) {
    renderContent = (
      <div>
        <div className="element-delete">
          <IconDelete onPointerDown={onPointerDown} />
        </div>
        <div>{t("Drop content here")}</div>
      </div>
    );
  }

  const isContentElement = NodeUtils.isContentElement(element);
  const isUniversalElement = NodeUtils.isUniversalElement(element);

  if (isUniversalElement) {
    renderContent = (
      <>
        <div
          className="universal-element-editing-mask"
          onMouseMove={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        ></div>
      </>
    );
    if (isSectionCategory) {
      renderContent = (
        <>
          {renderContent}
          <div className="section-category-hover"></div>
        </>
      );
    }
    if (isWrapperCategory) {
      renderContent = (
        <>
          {renderContent}
          <div className="wrapper-category-hover"></div>
        </>
      );
    }
  }

  return (
    <>
      {createPortal(
        <>
          {isContentElement ? (
            <>
              <td>{renderContent}</td>
            </>
          ) : (
            renderContent
          )}

          <style>{styleText}</style>
        </>,
        nodeElement
      )}
    </>
  );
};
