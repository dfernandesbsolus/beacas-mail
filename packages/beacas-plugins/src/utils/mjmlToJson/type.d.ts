export interface MjmlBlockItem {
  tagName: string;
  children: MjmlBlockItem[];
  attributes: { [key: string]: string };
  content?: string;
  inline?: "inline";
}
