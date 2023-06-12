import React, { ComponentProps, useCallback, useEffect, useState } from "react";
import { Form, FormItemProps } from "@arco-design/web-react";
import { debounce, get, isUndefined, set } from "lodash";
import { useSlate } from "slate-react";
import { Node, Path } from "slate";
import { useEditorContext, useRefState } from "beacas-editor";
import {
  getNodePathName,
  useEditorForm,
} from "@beacas-plugins/hooks/useEditorForm";
import { Element } from "beacas-core";
import { useElementDefault } from "@beacas-plugins/hooks";

export interface EnhancerProps {
  path: Path | null;
  name: string;
  label: React.ReactNode;
  formItem?: FormItemProps;
  fallbackValue?: any;
  onChange?: (...rest: any) => void;
}

export const enhancer = <P extends React.FC<any>>(Component: P) => {
  return (
    props: EnhancerProps & Omit<ComponentProps<P>, "value" | "onChange">
  ) => {
    if (props.path) {
      return <SlateField {...props} path={props.path} Component={Component} />;
    }
    return <NotSlateField {...props} Component={Component} />;
  };
};

const SlateField = <P extends { onChange?: (...rest: any) => any }>(
  props: EnhancerProps &
    Omit<P, "value" | "onChange"> & {
      Component: React.FC<any>;
    } & { path: Path }
) => {
  const {
    formItem,
    Component,
    fallbackValue: propsFallbackValue,
    ...rest
  } = props;
  const fieldName = getNodePathName(props.path, props.name);

  const editor = useSlate();
  const { form } = Form.useFormContext();
  const formItemFieldValue = form.getFieldValue(fieldName);

  let source: Element | null = null;
  try {
    source = Node.get(editor, props.path) as Element;
  } catch (error) {}

  const defaultElement = useElementDefault({
    path: props.path,
    type: get(source, "type", null) as Element["type"] | null,
  });

  let fallbackValue = propsFallbackValue;

  if (isUndefined(fallbackValue)) {
    fallbackValue = props.name
      ? get(source, props.name, get(defaultElement, props.name))
      : source || defaultElement;
  }
  const { setFieldValue } = useEditorForm();

  const onChangeHandle = useRefState((value: any, ...args: any[]) => {
    setFieldValue(props.path, props.name, value);
    rest.onChange?.(value, ...args);
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(
    debounce((ev: any, ...rest: any[]) => {
      onChangeHandle.current(ev, ...rest);
    }),
    [onChangeHandle]
  );

  useEffect(() => {
    if (fallbackValue !== formItemFieldValue) {
      form.setFieldValue(fieldName, fallbackValue);
    }
  }, [fallbackValue, fieldName, form, formItemFieldValue]);

  return (
    <Form.Item
      key={props.name}
      initialValue={fallbackValue}
      labelCol={{
        span: 7,
        offset: 1,
        style: { lineHeight: 1.15 },
      }}
      wrapperCol={{ span: 14 }}
      {...formItem}
      label={props.label}
      field={fieldName}
    >
      <Component autoComplete="off" {...rest} onChange={onChange} />
    </Form.Item>
  );
};

const NotSlateField = <P extends { onChange?: (...rest: any) => any }>(
  props: EnhancerProps &
    Omit<P, "value" | "onChange"> & {
      Component: React.FC<any>;
    }
) => {
  const { formItem, fallbackValue, Component: Com, ...rest } = props;
  const { values, setValues } = useEditorContext();
  const [inited, setInited] = useState(false);
  const { form } = Form.useFormContext();
  const currentValue = get(values, props.name);

  const onChangeHandle = useRefState((ev: any, ...rest: any[]) => {
    const newVal = ev;

    set(values, props.name, newVal);
    setValues({ ...values });

    props.onChange?.(ev, ...rest);
  });

  const onChange = useCallback(
    (ev: any, ...rest: any[]) => {
      onChangeHandle.current(ev, ...rest);
    },
    [onChangeHandle]
  );

  useEffect(() => {
    if (!inited) {
      if (!isUndefined(currentValue)) {
        onChangeHandle.current(currentValue);
        form.setFieldValue(props.name, currentValue);
      }
    }
    setInited(true);
  }, [currentValue, form, inited, onChangeHandle, props.name]);

  return (
    <Form.Item
      initialValue={currentValue || fallbackValue}
      labelCol={{
        span: 8,
        offset: 1,
        style: { lineHeight: 1.15 },
      }}
      wrapperCol={{ span: 14 }}
      {...formItem}
      label={props.label}
      field={props.name}
      onChange={onChange}
    >
      <Com autoComplete="off" {...rest} />
    </Form.Item>
  );
};
