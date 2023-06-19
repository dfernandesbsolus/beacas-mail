import { Radio } from "@arco-design/web-react";
import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import { LayoutItemList } from "./LayoutItemList";

const columnsOptions = [
  {
    label: 1,
    value: 1,
    columns: [["100%"]],
  },
  {
    label: 2,
    value: 2,
    columns: [
      ["50%", "50%"],
      ["33%", "67%"],
      ["67%", "33%"],
      ["25%", "75%"],
      ["75%", "25%"],
    ],
  },
  {
    label: 3,
    value: 3,
    columns: [
      ["33.33%", "33.33%", "33.33%"],
      ["25%", "50%", "25%"],
      ["25%", "25%", "50%"],
      ["50%", "25%", "25%"],
    ],
  },
  {
    label: 4,
    value: 4,
    columns: [["25%", "25%", "25%", "25%"]],
  },
];

export const ColumnLayout = ({
  onSelectColumn,
}: {
  onSelectColumn: (columns: string[]) => void;
}) => {
  const [columnNumbersIndex, setColumnNumbersIndex] = useState(1);
  const [columnLayoutIndex, setColumnLayoutIndex] = useState(0);
  const onSelectColumnRef = useRef(onSelectColumn);

  useEffect(() => {
    setColumnLayoutIndex(0);
  }, [columnNumbersIndex]);

  const matchOption = columnsOptions.find(
    (item) => item.value === columnNumbersIndex
  );

  useEffect(() => {
    const o = matchOption?.columns[columnLayoutIndex];
    if (o) {
      onSelectColumnRef.current(o);
    }
  }, [columnLayoutIndex, matchOption?.columns]);

  return (
    <div className="ColumnLayout">
      <div>
        <Radio.Group
          value={columnNumbersIndex}
          type="button"
          name="position"
          onChange={setColumnNumbersIndex}
          style={{ width: "100%" }}
        >
          {columnsOptions.map((option) => {
            return (
              <Radio
                key={option.value}
                style={{ width: "25%", margin: 0, textAlign: "center" }}
                value={option.value}
              >
                <div style={{ height: 28, lineHeight: "28px" }}>
                  {option.label}
                </div>
              </Radio>
            );
          })}
        </Radio.Group>
      </div>
      <LayoutItemList
        columns={matchOption?.columns || []}
        onSelect={setColumnLayoutIndex}
        selectedIndex={columnLayoutIndex}
      />
    </div>
  );
};
