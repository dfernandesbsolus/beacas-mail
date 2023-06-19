import { cloneDeep, get } from "lodash";
import React from "react";
import { Editor, Transforms } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import { ColumnElement, Element, StandardType } from "beacas-core";
import { onDrag } from "@beacas-plugins/utils/onDrag";
import styleText from "./index.scss?inline";

export const BlockResizer = ({
  element,
  top,
  bottom,
  left,
  right,
  percent,
  verticalScale = 1,
  horizontalScale = 1,
}: {
  element: Element;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  percent?: boolean;
  verticalScale?: number;
  horizontalScale?: number;
}) => {
  const editor = useSlateStatic();

  const onPointDown = (
    ev: React.MouseEvent<HTMLElement, MouseEvent>,
    direction: "left" | "right" | "top" | "bottom"
  ) => {
    ev.preventDefault();
    ev.stopPropagation();
    const domNode = get(ev.target, "offsetParent.offsetParent") as
      | HTMLElement
      | undefined;

    if (!domNode) return;

    const clientRect = domNode.getBoundingClientRect();
    const path = ReactEditor.findPath(editor, element);

    const parentElement = Editor.parent(editor, path)?.[0] as Element;
    if (!parentElement) return;

    const parentNode = ReactEditor.toDOMNode(editor, parentElement);
    const parentNodeClientRect = parentNode.getBoundingClientRect();

    const cloneAttributes = cloneDeep(element.attributes) as Record<
      string,
      string
    >;
    const maxWidth = parentNodeClientRect.width;
    const initialWidth = Math.min(
      parseInt(clientRect.width.toString()),
      maxWidth
    );
    const initialHeight = Math.min(parseInt(clientRect.height.toString()));

    onDrag({
      contentWindow: ReactEditor.getWindow(editor),
      event: ev as any,
      onMove(x: number, y: number) {
        if (direction === "left" || direction === "right") {
          const diffX = direction === "left" ? -x : x;
          cloneAttributes.width =
            parseInt(
              Math.max(
                20,
                Math.min(initialWidth + diffX * horizontalScale, maxWidth)
              ).toString()
            ) + "px";

          if (percent) {
            cloneAttributes.width =
              Math.min(
                100,
                parseInt(
                  (
                    (parseInt(cloneAttributes.width) / initialWidth) *
                    horizontalScale *
                    parseInt((element.attributes as any).width!)
                  ).toString()
                )
              ) + "%";
          }

          Transforms.setNodes(
            editor,
            {
              attributes: { ...cloneAttributes },
            },
            {
              at: path,
            }
          );

          if (parentElement.type === StandardType.STANDARD_SECTION) {
            const noneRawChildren = parentElement.children;

            const prevColumn = noneRawChildren[
              noneRawChildren.findIndex((node) => node === element) - 1
            ] as ColumnElement | undefined;

            if (prevColumn) {
              const diffWidth =
                parseInt((element.attributes as any).width) -
                parseInt(cloneAttributes.width);

              const prevColumnWidth =
                parseInt(prevColumn.attributes.width || "100") +
                diffWidth +
                "%";
              const prevColumnPath = ReactEditor.findPath(editor, prevColumn);
              Transforms.setNodes(
                editor,
                {
                  attributes: { ...prevColumn, width: prevColumnWidth },
                },
                {
                  at: prevColumnPath,
                }
              );
            }
          }
        } else {
          const diffY = direction === "top" ? -y : y;
          cloneAttributes.height =
            parseInt(
              Math.min(
                100,
                Math.max(10, Math.min(initialHeight + diffY * verticalScale))
              ).toString()
            ) + "px";

          Transforms.setNodes(
            editor,
            {
              attributes: { ...cloneAttributes },
            },
            {
              at: path,
            }
          );
        }
      },
    });
  };

  const onPointDownTop: React.DOMAttributes<HTMLElement>["onMouseDown"] = (
    ev
  ) => {
    onPointDown(ev, "top");
  };
  const onPointDownBottom: React.DOMAttributes<HTMLElement>["onMouseDown"] = (
    ev
  ) => {
    onPointDown(ev, "bottom");
  };
  const onPointDownLeft: React.DOMAttributes<HTMLElement>["onMouseDown"] = (
    ev
  ) => {
    onPointDown(ev, "left");
  };
  const onPointDownRight: React.DOMAttributes<HTMLElement>["onMouseDown"] = (
    ev
  ) => {
    onPointDown(ev, "right");
  };

  return (
    <span className="beacas-block-resizer-wrapper">
      {left && (
        <span
          className="beacas-block-resizer"
          style={{
            left: "0",
            top: "0px",
            height: "100%",
            width: "15px",
            cursor: "col-resize",
            pointerEvents: "auto",
            transform: "translate(-100%,0)",
          }}
          onPointerDown={onPointDownLeft}
        >
          <span className="beacas-block-resizer-scrollbar" style={{}} />
        </span>
      )}
      {right && (
        <span
          onPointerDown={onPointDownRight}
          className="beacas-block-resizer"
          style={{
            right: "-15px",
            top: "0px",
            height: "100%",
            width: "15px",
            cursor: "col-resize",
          }}
        >
          <span className="beacas-block-resizer-scrollbar" />
        </span>
      )}
      {top && (
        <span
          className="beacas-block-resizer"
          style={{
            left: "0px",
            top: "-15px",
            height: "15px",
            width: "100%",
            cursor: "row-resize",
            pointerEvents: "none",
          }}
        >
          <span
            className="beacas-block-resizer-scrollbar-horizontal"
            onPointerDown={onPointDownTop}
            style={{
              pointerEvents: "auto",
            }}
          />
        </span>
      )}
      {bottom && (
        <span
          className="beacas-block-resizer"
          style={{
            left: "0px",
            bottom: "-20px",
            height: "20px",
            width: "100%",
            cursor: "row-resize",
          }}
          onPointerDown={onPointDownBottom}
        >
          <span
            style={{
              pointerEvents: "auto",
            }}
            className="beacas-block-resizer-scrollbar-horizontal "
          />
        </span>
      )}

      <style>{styleText}</style>
    </span>
  );
};
