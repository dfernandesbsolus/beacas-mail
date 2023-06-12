import { EnhancerProps } from "@beacas-plugins/components/Form/enhancer";
import { useEditorForm } from "@beacas-plugins/hooks";
import { t } from "beacas-core";
import React, { useMemo } from "react";
import { Path } from "slate";
import { AttributeField } from ".";

const backgroundSizeOptions = [
  {
    value: "auto",
    label: "Auto",
  },
  {
    value: "contain",
    label: "Contain",
  },
  {
    value: "cover",
    label: "Cover",
  },
  {
    value: "100% 100%",
    label: "Full",
  },
];

export function BackgroundImage(
  props: Omit<EnhancerProps, "label"> & {
    label?: React.ReactNode;
    path: Path;
    hideBackgroundSize?: boolean;
  }
) {
  const { getFieldValue } = useEditorForm();

  const isEnabledImage = getFieldValue(
    props.path,
    props.name + ".background-image-enabled"
  );

  return useMemo(() => {
    return (
      <>
        <AttributeField.SwitchField
          path={props.path}
          label={t("Image")}
          name={props.name + ".background-image-enabled"}
        />
        {isEnabledImage && (
          <>
            <AttributeField.ImageUrl
              hideInput
              {...props}
              name={props.name + ".background-url"}
              formItem={{ layout: "vertical", ...props.formItem }}
            />
            {!props.hideBackgroundSize && (
              <AttributeField.SelectField
                {...props}
                label={t("Format")}
                options={backgroundSizeOptions}
                name={props.name + ".background-size"}
              />
            )}
            <AttributeField.BackgroundPosition
              {...props}
              label={t("Position")}
              name={props.name + ".background-position"}
            />
          </>
        )}
      </>
    );
  }, [isEnabledImage, props]);
}
