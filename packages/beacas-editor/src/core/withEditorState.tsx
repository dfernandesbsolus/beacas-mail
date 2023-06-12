import { CustomSlateEditor } from "@beacas-editor/typings/custom-types";
import React from "react";
import { ReactEditor, useSlate } from "slate-react";
import { ElementProps } from "@beacas-editor/components/Elements";
import { BlockManager } from "beacas-core";

export const withEditorState = (Com: React.FC<ElementProps>) => {
  return (props: ElementProps) => {
    const Component = Com;
    const editor = useSlate();

    const elementPath = ReactEditor.findPath(editor, props.element).join("-");

    (props.attributes as any)["data-slate-type"] = props.element.type;
    (props.attributes as any)["data-slate-path"] = elementPath;

    const block = BlockManager.getBlockByType(props.element.type);
    (props.attributes as any)["data-slate-void"] = block.void || undefined;

    const instance = <Component {...props} />;

    return instance;
  };
};

export interface CustomSlateEditorState {
  editor: CustomSlateEditor;
  selected: boolean;
  focused: boolean;
}
