import { Button, ButtonProps } from "@arco-design/web-react";
import { useRefState } from "beacas-editor";
import React, { useCallback } from "react";
import { ComponentProps } from "react";
import { enhancer } from "./enhancer";

const DefaultButton = (
  props: ComponentProps<typeof Button> & {
    renderProps: (isActive: boolean) => ButtonProps;
    value: boolean;
    onChange: (val: boolean) => void;
  }
) => {
  const { renderProps, ...rest } = props;
  const changeRef = useRefState(props.onChange);

  const onClick = useCallback(() => {
    changeRef.current(!props.value);
  }, [changeRef, props.value]);

  return <Button {...rest} {...renderProps(props.value)} onClick={onClick} />;
};

export const ButtonField = enhancer(DefaultButton);
