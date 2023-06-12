import { Space, Tooltip } from "@arco-design/web-react";
import { IconQuestionCircle } from "@arco-design/web-react/icon";
import { EnhancerProps } from "@beacas-plugins/components/Form/enhancer";
import { useEditorForm } from "@beacas-plugins/hooks";
import { t } from "beacas-core";
import React, { useMemo } from "react";
import { Path } from "slate";
import { AttributeField } from ".";
import { useSelectedNode } from "beacas-editor";

export function Columns(
  props: Omit<EnhancerProps, "label"> & {
    path: Path;
  }
) {
  const { setFieldValue } = useEditorForm();
  const { selectedNode } = useSelectedNode();

  const disabled = Boolean(selectedNode && selectedNode.children.length > 1);

  return useMemo(() => {
    const columnPath = [...props.path, 0];
    return (
      <>
        <AttributeField.StackOnMobile path={props.path} />

        {!disabled && (
          <AttributeField.PixelAndPercentField
            disabled={disabled}
            onChange={(value) => {
              setFieldValue(columnPath, "attributes.width", value);
            }}
            formItem={{
              labelCol: {
                span: 14,
              },
              wrapperCol: {
                span: 10,
              },
            }}
            label={
              <Space>
                {t("Desktop width")}
                <Tooltip content={t("Only one column  can be set")}>
                  <IconQuestionCircle />
                </Tooltip>
              </Space>
            }
            path={columnPath}
            name={"attributes.width"}
            defaultPercentValue={"100%"}
            defaultPixelValue={undefined}
          />
        )}
      </>
    );
  }, [props.path, disabled, setFieldValue]);
}
