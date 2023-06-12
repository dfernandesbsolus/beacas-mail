import { EditorPropsContext } from "@beacas-editor/contexts";
import { EmailEditorProps } from "@beacas-editor/typings";
import { useContext } from "react";

export const useEditorProps = (): EmailEditorProps => {
  return useContext(EditorPropsContext);
};
