import {
  Select as ArcoSelect,
  SelectProps as ArcoSelectProps,
} from "@arco-design/web-react";
import { merge } from "lodash";
import React, { useMemo } from "react";

export interface SelectProps extends ArcoSelectProps {
  options: Array<{ value: any; label: React.ReactNode }>;
  onChange?: (val: string) => void;
  value: string;
}

export const Select = (props: SelectProps) => {
  const options = useMemo(() => props.options || [], [props.options]);
  return (
    <ArcoSelect
      {...props}
      dropdownMenuClassName="realmail-overlay"
      style={merge({ width: "100%" }, props.style)}
      value={props.value}
      onChange={props.onChange}
    >
      {options.map((item, index) => (
        <ArcoSelect.Option key={index} value={item.value}>
          {item.label}
        </ArcoSelect.Option>
      ))}
    </ArcoSelect>
  );
};
