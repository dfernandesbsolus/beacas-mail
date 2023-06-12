import { TextFormat } from "@beacas-editor/constants";
import { CustomSlateEditor } from "@beacas-editor/typings";
import { Transforms, Text } from "slate";
import { isFormatActive } from "./isFormatActive";

export const toggleFormat = (editor: CustomSlateEditor, format: TextFormat) => {
  const isActive = isFormatActive(editor, format);
  if (!editor.selection?.anchor) return;
  if (format === TextFormat.REMOVE_FORMAT) {
    Transforms.unsetNodes(editor, Object.values(TextFormat), {
      match: Text.isText,
      split: true,
    });
    return;
  }
  Transforms.setNodes(
    editor,
    {
      [format]: isActive ? null : true,
    },
    { match: Text.isText, split: true }
  );
};
