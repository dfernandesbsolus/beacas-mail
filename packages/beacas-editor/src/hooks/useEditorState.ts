import { InteractContext } from "@beacas-editor/contexts";
import { useContext } from "react";

export const useEditorState = () => {
  return useContext(InteractContext);
};
