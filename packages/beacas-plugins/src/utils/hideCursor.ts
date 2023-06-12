import { CustomSlateEditor } from "beacas-editor";
import { ReactEditor } from "slate-react";

export const hideCursor = (editor: CustomSlateEditor) => {
  const root = ReactEditor.getWindow(editor);
  root.document.body.setAttribute("data-slate-hide-cursor", "true");

  root.document.body.addEventListener("mousemove", () => {
    root.document.body.removeAttribute("data-slate-hide-cursor");
  });
};
