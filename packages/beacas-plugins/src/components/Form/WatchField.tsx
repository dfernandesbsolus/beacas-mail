import { Form } from "@arco-design/web-react";
import { useElementDefault } from "@beacas-plugins/hooks";
import { useEditorForm } from "@beacas-plugins/hooks/useEditorForm";
import { useEditorContext, useRefState } from "beacas-editor";
import { get, set } from "lodash";
import React from "react";
import { useEffect } from "react";
import { Path } from "slate";

export interface WatchFieldProps {
  name: string;
  watchFieldName: string;
  onChange?: (val: any) => void;
  sync?: boolean;
  path?: Path;
  watchPath?: Path;
}
export const WatchField = (props: WatchFieldProps) => {
  if (props.path) return <SlateField {...props} path={props.path} />;

  return <NotSlateField {...props} />;
};

const SlateField = (props: WatchFieldProps & { path: Path }) => {
  const { setFieldValue, getFieldValue } = useEditorForm();

  const watchPath = props.watchPath || props.path;

  let currentValue = getFieldValue(props.path, props.name);

  const element = useElementDefault({ path: props.path, type: null });

  if (element) {
    currentValue = get(element, props.name);
  }

  const watchValue = getFieldValue(watchPath, props.watchFieldName);

  useEffect(() => {
    if (currentValue !== watchValue) {
      props.onChange?.(watchValue);
      if (props.sync) {
        setFieldValue(props.path, props.name, watchValue);
      }
    }
  }, [currentValue, props, setFieldValue, watchValue]);

  return null;
};

const NotSlateField = (props: WatchFieldProps) => {
  const { form } = Form.useFormContext();
  const { values, setValues } = useEditorContext();
  const currentValue = get(values, props.name);
  const watchValue = get(values, props.watchFieldName);
  const onChangeRef = useRefState(props.onChange);
  const valuesRef = useRefState(values);

  useEffect(() => {
    if (currentValue !== watchValue) {
      onChangeRef.current?.(watchValue);
      if (props.sync) {
        const values = valuesRef.current;
        set(values, props.name, watchValue);
        setValues({ ...values });
        form.setFieldValue(props.name, watchValue);
      }
    }
  }, [
    currentValue,
    form,
    onChangeRef,
    props.name,
    props.sync,
    setValues,
    valuesRef,
    watchValue,
  ]);

  return null;
};
