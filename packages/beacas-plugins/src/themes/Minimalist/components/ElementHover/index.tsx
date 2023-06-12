import { EmailEditorProps, isDOMElement } from "beacas-editor";
import { observer } from "mobx-react";
import { ElementCategory, Element, BlockManager, t } from "beacas-core";
import React, { useRef } from "react";
import { ReactEditor, useSlate } from "slate-react";
import { Transforms, Editor, Path } from "slate";
import styleText from "./index.scss?inline";
import { IconFont } from "@beacas-plugins/components/IconFont";
import { useDragging } from "@beacas-plugins/hooks/useDragging";
import { BlockResizer } from "../BlockResizer";
import { createPortal } from "react-dom";
import { cloneDeep } from "lodash";

export const ElementHover: NonNullable<EmailEditorProps["ElementHover"]> =
  observer(({ element, nodeElement, path }) => {
    const { dragHandle } = useDragging({
      element: element,
      nodeElement,
      action: "move",
      cloneGhost: true,
    });

    const editor = useSlate();
    const hoverContainerRef = useRef<HTMLDivElement | null>(null);

    const onAddButtonClick: React.MouseEventHandler<HTMLDivElement> = (ev) => {
      ev.preventDefault();
      if (!isDOMElement(ev.target)) return;
      if (ev.altKey) {
        const node = ReactEditor.toSlateNode(editor, ev.target);
        const newPath = Path.next(ReactEditor.findPath(editor, node));
        Transforms.insertNodes(editor, cloneDeep(node), {
          at: newPath,
        });
        const at = Editor.end(editor, newPath);
        Transforms.setSelection(editor, { anchor: at, focus: at });
      } else {
        const node = ReactEditor.toSlateNode(editor, ev.target) as Element;

        const block = BlockManager.getBlockByType(node.type);
        const nodePath = ReactEditor.findPath(editor, node);

        Transforms.select(editor, nodePath);

        if (block.category.includes(ElementCategory.SECTION)) {
          editor.insertNewRow({
            path: nodePath,
          });
        } else {
          const at = Editor.end(editor, nodePath);
          Transforms.setSelection(editor, { anchor: at, focus: at });
          editor.insertBreak();
        }
      }
    };

    const renderContent = (
      <>
        <div
          contentEditable={false}
          className="element-hover-container"
          ref={hoverContainerRef}
        >
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
              <div>
                <IconFont
                  iconName="icon-add"
                  style={{ cursor: "grab" }}
                  onClick={onAddButtonClick}
                />
              </div>
            </div>
            <div className="element-selected-tools-item" {...dragHandle}>
              <IconFont iconName="icon-drag" style={{ cursor: "grab" }} />
            </div>
          </div>
        </div>

        {/* dragover */}
        <div className="element-dragover" />

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

    if (block.category.includes(ElementCategory.IMAGE)) {
      return (
        <>
          {createPortal(<td>{renderContent}</td>, nodeElement)}
          <BlockResizer element={element} left right horizontalScale={2} />;
        </>
      );
    }

    return <>{renderContent}</>;
  });
