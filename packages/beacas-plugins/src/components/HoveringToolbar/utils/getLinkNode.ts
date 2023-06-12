import { CustomSlateEditor, TextFormat } from "beacas-editor";
import { Editor, NodeEntry, Text } from "slate";

export const getLinkNode = (editor: CustomSlateEditor) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => {
      return Text.isText(n) && Boolean(n[TextFormat.LINK]);
    },
  });
  return match as NodeEntry<Text> | undefined;
};
