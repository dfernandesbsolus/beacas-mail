import { EnhancerProps } from "@beacas-plugins/components/Form/enhancer";
import { ActiveTabKeys } from "beacas-editor";
import React, { ComponentProps, useContext, useMemo } from "react";
import { ResponsiveTabsContext } from ".";

export const ResponsiveField = <P extends React.FC<any>>({
  component,
  ...props
}: ComponentProps<P> &
  Pick<EnhancerProps, "name" | "path"> & {
    component: P;
  }) => {
  const Com = component;

  const { activeTab } = useContext(ResponsiveTabsContext);

  return useMemo(
    () => (
      <Com
        {...props}
        name={
          activeTab === ActiveTabKeys.DESKTOP
            ? props.name
              ? `attributes.${props.name}`
              : "attributes"
            : props.name
            ? `mobileAttributes.${props.name}`
            : "mobileAttributes"
        }
      />
    ),
    [Com, activeTab, props]
  );
};
