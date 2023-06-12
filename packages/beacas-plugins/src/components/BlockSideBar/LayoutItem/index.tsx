import { Collapse } from "@arco-design/web-react";
import { useDragging } from "@beacas-plugins/hooks";
import {
  BlockManager,
  classnames,
  ElementType,
  StandardSectionElement,
  StandardType,
} from "beacas-core";
import React, { useMemo } from "react";
import "./index.scss";

export const LayoutItem = ({
  columns,
  title,
}: {
  columns: string[][];
  title: string;
}) => {
  return (
    <Collapse.Item contentStyle={{ padding: 10 }} header={title} name={title}>
      <div className="LayoutItemList">
        {columns.map((column, index) => {
          return (
            <div
              key={index}
              className="LayoutItemList"
              style={{ marginBottom: index === columns.length - 1 ? 0 : 10 }}
            >
              <ColumnElement column={column} key={index} />
            </div>
          );
        })}
      </div>
    </Collapse.Item>
  );
};

const ColumnElement = ({ column }: { column: string[] }) => {
  const element = useMemo(() => {
    const sectionBlock = BlockManager.getBlockByType(
      ElementType.STANDARD_SECTION
    );
    return sectionBlock.create({
      attributes: {
        "background-repeat": "no-repeat",
      },
      children: column.map((col) => ({
        type: StandardType.STANDARD_COLUMN,
        attributes: {
          width: col,
        },
        data: {},
        children: [],
      })),
    });
  }, [column]);

  const { dragHandle } = useDragging({
    element: element,
    nodeElement: null,
    action: "copy",
    cloneGhost: false,
  });

  return (
    <div {...dragHandle} className={classnames("LayoutItem")}>
      <div className="LayoutItemOuter">
        <div className="LayoutItemInner">
          {column.map((width, index) => {
            return (
              <div
                className={classnames("LayoutItemInnerPart")}
                key={index}
                style={{
                  width: width,
                  borderRight: index === column.length - 1 ? "none" : undefined,
                }}
              >
                {width}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
