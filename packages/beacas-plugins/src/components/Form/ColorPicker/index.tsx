import { Input, Popover, PopoverProps } from "@arco-design/web-react";
import React, { ComponentProps, useEffect, useMemo, useState } from "react";

import { ColorPickerContent } from "./ColorPickerContent";
import Color from "color";
import { MERGE_TAG_PATTERN } from "beacas-core";
import { BeacasCore } from "beacas-core";
import { CustomEvent, useEventCallback, validation } from "beacas-editor";
import colorImg from "@beacas-plugins/assets/images/color.png?url";
import { enhancer } from "../enhancer";
import { colorAdapter } from "../adapter";
import transparentIcon from "@beacas-plugins/assets/images/transparent.png";

export interface ColorPickerProps extends PopoverProps {
  onChange?: (val: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  value?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  showInput?: boolean;
  placeholder?: string;
}

const transparentColor = "rgba(0,0,0,0)";

function ColorPicker(props: ColorPickerProps) {
  const {
    value = "",
    onChange,
    children,
    showInput = true,
    placeholder = "",
  } = props;
  const [popupVisible, setPopupVisible] = useState(false);

  const mergeTagColor = useMemo(() => {
    const isMatch = MERGE_TAG_PATTERN.test(value);
    if (isMatch) {
      return BeacasCore.renderWithData(value, {});
    }
    try {
      if (Color(`#${value}`).hex()) return `#${value}`;
    } catch (error) {}
    return value;
  }, [value]);

  const onInputChange = useEventCallback((value: string) => {
    onChange?.(value);
  });

  const onClose = useEventCallback(() => {
    setPopupVisible(false);
  });

  const inputColor = mergeTagColor.replace(/#/, "");

  useEffect(() => {
    const onHandle = () => {
      setPopupVisible(false);
    };
    window.addEventListener(CustomEvent.EDITOR_CLICK, onHandle);
    return () => {
      window.removeEventListener(CustomEvent.EDITOR_CLICK, onHandle);
    };
  }, []);

  return (
    <div style={{ flex: 1, display: "flex" }}>
      <Popover
        popupVisible={popupVisible}
        onVisibleChange={setPopupVisible}
        title={""}
        trigger="click"
        {...props}
        className="color-picker-popup"
        content={
          <ColorPickerContent
            onClose={onClose}
            value={mergeTagColor}
            onChange={onInputChange}
          />
        }
      >
        {children || (
          <div
            style={{
              display: "inline-block",
              height: 32,
              width: 32,
              boxSizing: "border-box",
              padding: 4,
              border: "1px solid var(--color-neutral-6, rgb(229, 230, 235))",
              borderRadius: showInput ? undefined : 4,
              fontSize: 0,
              borderRight: showInput ? "none" : undefined,
              position: "relative",
              cursor: "pointer",
            }}
          >
            {mergeTagColor ? (
              <span
                style={{
                  position: "relative",
                  display: "block",
                  border:
                    "1px solid var(--color-neutral-6, rgb(229, 230, 235))",
                  boxSizing: "border-box",
                  borderRadius: 2,
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  backgroundColor: mergeTagColor,
                }}
              />
            ) : (
              <img
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  filter:
                    "invert(  0.78  )  drop-shadow(0 0px 0 rgb(0 0 0 / 45%))",
                }}
                src={colorImg}
              />
            )}
            <style>
              {`
                [title="${transparentColor}"] {
                  background-image: url("${transparentIcon}") !important
                }

                `}
            </style>
          </div>
        )}
      </Popover>
      {showInput && (
        <Input
          prefix="#"
          value={inputColor}
          style={{ outline: "none", flex: 1 }}
          onChange={onInputChange}
          allowClear
          onBlur={props.onBlur}
          placeholder={placeholder?.replace("#", "")}
        />
      )}
    </div>
  );
}

const DefaultColorPicker = enhancer(ColorPicker);

export const ColorPickerField = (
  props: ComponentProps<typeof DefaultColorPicker>
) => {
  return (
    <DefaultColorPicker
      {...props}
      formItem={{
        ...colorAdapter,
        rules: [
          {
            validator(value, callback) {
              const Validate = validation.color.typeConstructor();
              const errMsg = new Validate(value || "").getErrorMessage();
              if (errMsg) {
                callback(errMsg);
              }
            },
          },
        ],
        ...props.formItem,
      }}
    />
  );
};
