import { EmailEditorProps } from "beacas-editor";

import { observer } from "mobx-react";
import React from "react";
import styleText from "./index.scss?inline";

export const ElementSelected: NonNullable<EmailEditorProps["ElementSelected"]> =
  observer(() => {
    return (
      <>
        <style>{styleText}</style>
      </>
    );
  });
