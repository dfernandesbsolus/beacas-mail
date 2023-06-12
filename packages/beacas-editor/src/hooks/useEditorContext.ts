import { EditorContext } from "@beacas-editor/contexts";
import { useContext } from "react";

export const useEditorContext = () => {
  return useContext(EditorContext);
};
