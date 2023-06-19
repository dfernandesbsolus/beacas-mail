import { isDOMElement } from "beacas-editor";
import React from "react";
import styleText from "./index.scss?inline";
import { IconFont } from "@beacas-plugins/components/IconFont";
import { useDragging } from "@beacas-plugins/hooks";
import { createPortal } from "react-dom";
import { ReactEditor, useSlate } from "slate-react";
import {
  NodeUtils,
  Element,
  BlockManager,
  ElementCategory,
  t,
} from "beacas-core";
import { Editor, Path, Transforms } from "slate";
import { cloneDeep, get } from "lodash";

export const ElementTools: React.FC<{
  element: Element;
  nodeElement: HTMLElement;
  path: Path;
}> = ({ element, nodeElement, path }) => {
  const editor = useSlate();

  const { dragHandle } = useDragging({
    element: element,
    nodeElement,
    action: "move",
    cloneGhost: true,
  });

  const isSectionCategory = BlockManager.getBlockByType(
    element.type
  ).category.includes(ElementCategory.SECTION);

  const isWrapperCategory = BlockManager.getBlockByType(
    element.type
  ).category.includes(ElementCategory.WRAPPER);

  const isFullWidth = get(element, "attributes.full-width") === "full-width";

  const onAddButtonClick: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    ev.preventDefault();
    if (!isDOMElement(ev.target)) return;
    const node = ReactEditor.toSlateNode(editor, ev.target);
    if (!NodeUtils.isElement(node)) return;

    const newPath = Path.next(ReactEditor.findPath(editor, node));
    if (ev.altKey) {
      Transforms.insertNodes(editor, cloneDeep(node), {
        at: newPath,
      });
      const at = Editor.end(editor, newPath);
      Transforms.setSelection(editor, { anchor: at, focus: at });
    } else {
      const block = BlockManager.getBlockByType(node.type);

      if (block.category.includes(ElementCategory.SECTION)) {
        editor.insertNewRow({
          path: newPath,
        });
      } else {
        editor.insertNewLine({
          path: newPath,
        });
      }
    }
  };

  const renderContent = (
    <>
      <div
        contentEditable={false}
        className="element-tools-container"
        data-is-section-category={isSectionCategory}
        data-is-wrapper-category={isWrapperCategory}
        data-is-full-width={isFullWidth}
      >
        <div contentEditable={false} className="element-hover-container">
          <div className="element-hover-tools">
            <div className="element-selected-tools-item">
              <div className="element-selected-tools-item-tooltip">
                <div>
                  {t("Click to")}{" "}
                  <span style={{ color: "#82817f" }}>
                    {t("to add a block below")}
                  </span>
                </div>
                <div>
                  {t("Option-click")}{" "}
                  <span style={{ color: "#82817f" }}>
                    {t("to copy a block below")}
                  </span>
                </div>
                {/* <div>
                    command-click{" "}
                    <span style={{ color: "#82817f" }}>
                      to copy block below
                    </span>
                  </div> */}
              </div>
              <div onPointerDown={onAddButtonClick}>
                <IconFont iconName="icon-add" style={{ cursor: "grab" }} />
              </div>
            </div>
            <div className="element-selected-tools-item" {...dragHandle}>
              <IconFont iconName="icon-drag" style={{ cursor: "grab" }} />
            </div>
          </div>
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
