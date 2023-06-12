import { IconLink } from "@arco-design/web-react/icon";
import { isValidHttpUrl } from "@beacas-plugins/utils/isValidHttpUrl";

import { NodeUtils, t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

export function Link(
  props: Omit<ComponentProps<typeof AttributeField.TextField>, "label"> & {
    label?: React.ReactNode;
  }
) {
  const { label = t("URL") } = props;
  return useMemo(() => {
    return (
      <AttributeField.TextField
        prefix={<IconLink />}
        {...props}
        label={label}
        formItem={{
          rules: [
            {
              validator(value, callback) {
                const isValid =
                  isValidHttpUrl(value) || NodeUtils.isMergeTag(value);
                if (!isValid) {
                  callback(t("Invalid URL"));
                }
              },
            },
          ],
          ...props.formItem,
        }}
      />
    );
  }, [label, props]);
}
