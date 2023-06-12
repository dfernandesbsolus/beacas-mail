import React from "react";
import { createContext } from "react";
import { EmailEditorProps } from "..";

export const EditorPropsContext = createContext<EmailEditorProps>({} as any);

export const EditorPropsProvider: React.FC<{
  value: EmailEditorProps;
  children: React.ReactNode;
}> = (props) => {
  return (
    <EditorPropsContext.Provider value={props.value}>
      {props.children}
    </EditorPropsContext.Provider>
  );
};
