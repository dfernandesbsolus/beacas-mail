import { Button, Grid, Radio, Space } from "@arco-design/web-react";
import React from "react";
import { ComponentProps } from "react";
import { enhancer } from "./enhancer";

const DefaultButtonGroup = (
  props: ComponentProps<typeof Button> & {
    value: string;
    onChange: (val: string) => void;
    options: Array<{ label: React.ReactNode; value: string }>;
  }
) => {
  const { options, value, onChange, ...rest } = props;

  return (
    <Space direction="vertical">
      <Grid.Row justify="center">
        <Radio.Group
          {...rest}
          value={value}
          type="button"
          options={options}
          onChange={onChange}
        ></Radio.Group>
      </Grid.Row>
    </Space>
  );
};

export const ButtonGroupField = enhancer(DefaultButtonGroup);
