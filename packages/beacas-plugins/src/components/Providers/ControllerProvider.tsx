import { store } from "@beacas-plugins/store";
import { observer } from "mobx-react";
import React from "react";

export const ControllerProvider: React.FC<{ children: React.ReactNode }> =
  observer(({ children }) => {
    const { zoom } = store.editorState.state;
    return (
      <div
        id="ControllerProvider"
        style={{
          height: `${zoom}%`,
          width: "100%",
          transform: `scale(${zoom}%)`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    );
  });
