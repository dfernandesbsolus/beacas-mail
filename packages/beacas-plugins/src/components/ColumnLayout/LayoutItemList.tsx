import { classnames } from "beacas-core";
import React from "react";

export const LayoutItemList = ({
  columns,
  onSelect,
  selectedIndex,
}: {
  columns: string[][];
  selectedIndex: number;
  onSelect(index: number): void;
}) => {
  return (
    <div style={{ marginTop: 20 }} className="ColumnLayoutItemList">
      {columns.map((item, index) => {
        return (
          <div
            onClick={() => onSelect(index)}
            className={classnames(
              "ColumnLayoutItem",
              selectedIndex === index && "ColumnLayoutItemSelected"
            )}
            key={index}
            style={{
              marginBottom: 20,
            }}
          >
            <div className="ColumnLayoutItemOuter">
              <div className="ColumnLayoutItemInner">
                {item.map((column, index) => {
                  return (
                    <div
                      className={classnames("ColumnLayoutItemInnerPart")}
                      key={index}
                      style={{
                        width: column,
                        borderRight:
                          index === item.length - 1 ? "none" : undefined,
                      }}
                    >
                      {column}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
