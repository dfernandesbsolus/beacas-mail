import React from "react";
import { DraggingProvider } from "./DraggingProvider";
import { FormProvider } from "./FormProvider";
import { UniversalElementProvider } from "./UniversalElementProvider";

export * from "./DraggingProvider";
export * from "./ControllerProvider";

export const PluginsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <DraggingProvider>
      <FormProvider>
        <UniversalElementProvider>
          <>{children}</>
        </UniversalElementProvider>
      </FormProvider>
    </DraggingProvider>
  );
};
