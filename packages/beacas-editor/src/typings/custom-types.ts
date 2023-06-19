import { BaseEditor, Path, NodeEntry } from "slate";
import { ReactEditor } from "slate-react";
import { Element, TextNode } from "beacas-core";
import { HistoryEditor } from "slate-history";

export interface BeacasSlateEditor {
  splitColumns(options: { path: Path }): void;
  insertNewLine(options?: { path?: Path }): void;
  insertNewRow(options?: { path?: Path }): void;
  removeNode(options?: { path?: Path }): void;
  filterEmpty(options: { path: Path }): void;
  insertMergetag(options: { path?: Path; mergetag: string }): void;
  replaceNode(options: { path: Path; node: Partial<Element> }): void;
  moveNode(options: { at: Path; to: Path }): void;
  getSelectionRect(): null | DOMRect;
  getSelectedBlockElement(): null | NodeEntry<Element>;
}

export type CustomSlateEditor = BaseEditor &
  ReactEditor &
  HistoryEditor &
  BeacasSlateEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomSlateEditor;
    Element: Element;
    Text: TextNode;
  }
}
