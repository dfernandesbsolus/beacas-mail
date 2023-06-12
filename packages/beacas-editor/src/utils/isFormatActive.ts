import { CustomSlateEditor } from "@beacas-editor/typings";
import { Editor, Text } from "slate";
import { TextFormat } from "../constants";

export const isFormatActive = (
  editor: CustomSlateEditor,
  format: TextFormat
) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Text.isText(n) && Boolean((n as any)[format]),
    mode: "all",
  });
  return !!match;
};
