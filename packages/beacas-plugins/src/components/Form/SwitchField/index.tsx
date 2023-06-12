import { FormItemProps, Switch } from "@arco-design/web-react";
import React, { useMemo } from "react";
import { ComponentProps } from "react";
import { enhancer } from "../enhancer";

const DefaultSwitchField = enhancer(Switch);

export const SwitchField = (
  props: ComponentProps<typeof DefaultSwitchField>
) => {
  const formItem: FormItemProps = useMemo(
    () => ({
      ...props.formItem,
      triggerPropName: "checked",
      style: {},
    }),
    [props.formItem]
  );
  return (
    <DefaultSwitchField
      {...props}
      formItem={formItem}
      style={{ position: "relative", top: -6 }}
    />
  );
};
