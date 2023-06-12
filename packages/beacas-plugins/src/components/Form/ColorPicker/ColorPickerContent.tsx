import { Button, Space } from "@arco-design/web-react";
import React, { useEffect, useState } from "react";

import { IconClose } from "@arco-design/web-react/icon";
import { store } from "@beacas-plugins/store";

export interface ColorPickerContentProps {
  onChange: (val: string) => void;
  value: string;
  onClose?: () => void;
}

export function ColorPickerContent(props: ColorPickerContentProps) {
  const colors = store.colorState.state.list;

  const { onChange } = props;
  const [color, setColor] = useState(props.value);

  const onChangeColor = (val: string) => {
    store.colorState.addCurrentColor(val);
    setColor(val);
    onChange(val);
  };

  useEffect(() => {
    setColor(props.value);
  }, [props.value]);

  return (
    <div
      className={"colorPicker"}
      style={{ width: 202, paddingTop: 16, paddingBottom: 16 }}
    >
      <div className={"colorPickerCloseBtn"}>
        <Button
          onClick={props.onClose}
          icon={<IconClose color="#000" style={{ color: "#000" }} />}
          shape="circle"
          type="text"
        />
      </div>
      <div style={{ padding: "0px 16px" }}>
        <Space wrap size="mini">
          {colors.map((item) => {
            return (
              <div
                className={"presetColorItem"}
                title={item}
                onClick={() => onChangeColor(item)}
                key={item}
                style={{ backgroundColor: item }}
              />
            );
          })}
        </Space>
      </div>
      <div
        style={{
          padding: "6px 6px 0px 6px",
        }}
      >
        <Button
          type="text"
          size="small"
          style={{
            color: "#333",
            fontSize: 12,
            width: "100%",
            textAlign: "left",
            paddingLeft: 10,
            position: "relative",
            backgroundColor: "var(--color-fill-3)",
          }}
        >
          <span>Picker...</span>
          <input
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 1,
              left: 0,
              top: 0,
              opacity: 0,
              cursor: "pointer",
            }}
            type="color"
            value={color}
            onChange={(e) => onChangeColor(e.target.value)}
          />
        </Button>
      </div>
      <style>
        {`
          .form-alpha-picker {
            outline: 1px solid rgb(204, 204, 204, 0.6);
          }
          `}
      </style>
    </div>
  );
}
