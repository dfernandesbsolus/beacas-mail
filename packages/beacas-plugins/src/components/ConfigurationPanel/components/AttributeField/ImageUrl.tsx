import { Grid } from "@arco-design/web-react";
import { useEditorProps } from "beacas-editor";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

export function ImageUrl(
  props: Omit<
    ComponentProps<typeof AttributeField.ImageUploaderField>,
    "label"
  > & {
    label?: React.ReactNode;
    hideInput?: boolean;
  }
) {
  const { onUpload } = useEditorProps();
  return useMemo(() => {
    return (
      <Grid.Row>
        <Grid.Col span={22} offset={1}>
          <AttributeField.ImageUploaderField
            label=""
            hideInput
            uploadHandler={onUpload}
            formItem={{
              noStyle: true,
            }}
            {...props}
          />
        </Grid.Col>
      </Grid.Row>
    );
  }, [onUpload, props]);
}
