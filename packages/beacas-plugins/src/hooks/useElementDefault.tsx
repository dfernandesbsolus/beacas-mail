import { BlockManager, Element, PageElement } from "beacas-core";
import { merge } from "lodash";
import { useMemo } from "react";
import { Node, Path } from "slate";
import { useSlate } from "slate-react";

export const useElementDefault = <T extends Element>({
  path,
  type,
}: {
  path: Path | null;
  type: Element["type"] | null;
}): {
  attributes: T["attributes"];
  mobileAttributes: Partial<T["attributes"]>;
} => {
  const editor = useSlate();

  let source: Element | null = null;
  try {
    if (path) {
      source = Node.get(editor, path) as Element;
    }
  } catch (error) {}

  const pageElement = editor.children[0] as PageElement;

  const nodeType = type ? type : source?.type;

  const block = nodeType ? BlockManager.getBlockByType(nodeType) : null;

  const globalAttributes = pageElement.data.globalAttributes;
  const categoryAttributes =
    block && pageElement.data.categoryAttributes?.[block.category];
  const blockAttributes =
    nodeType && pageElement.data.blockAttributes?.[nodeType];

  const defaultAttributes = block && block.defaultData.attributes;

  const attributes = useMemo(() => {
    return merge(
      {},
      defaultAttributes,
      globalAttributes,
      categoryAttributes,
      blockAttributes,
      source?.attributes
    );
  }, [
    blockAttributes,
    categoryAttributes,
    defaultAttributes,
    globalAttributes,
    source?.attributes,
  ]);

  const mobileAttributes = useMemo(() => {
    return merge(
      {},
      defaultAttributes,
      globalAttributes,
      categoryAttributes,
      blockAttributes,
      source?.attributes,
      source?.mobileAttributes
    );
  }, [
    blockAttributes,
    categoryAttributes,
    defaultAttributes,
    globalAttributes,
    source?.attributes,
    source?.mobileAttributes,
  ]);

  return {
    attributes: attributes,
    mobileAttributes,
  };
};
