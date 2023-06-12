import {
  BlockManager,
  Element as BeacasElement,
  ElementType,
  TextNode,
} from "beacas-core";
import { camelCase } from "lodash";

export const HtmlNodeAdapter = (content: string) => {
  const div = document.createElement("div");
  div.innerHTML = content;

  return Array.from(div.childNodes).map((node) => {
    return getItemNode(node);
  });
};

const getItemNode = (node: ChildNode): TextNode | BeacasElement => {
  if (node.nodeType === Node.TEXT_NODE) {
    return {
      text: node.textContent?.replace(/^\s+/, " ").replace(/\s+$/, " ") || "",
    };
  } else if (node.nodeType === Node.ELEMENT_NODE && node instanceof Element) {
    const attrs: Record<string, string> = {};

    node.getAttributeNames().forEach((name) => {
      let key = camelCase(name);
      if (key === "class") {
        key = "className";
      }
      attrs[key] = node.getAttribute(name) || "";
    });

    const tagName = node.tagName.toLowerCase();

    if (tagName === "br") {
      return BlockManager.getBlockByType(ElementType.LINE_BREAK).create({
        attributes: {},
        data: {},
        children: [{ text: "" }],
      });
    }

    return BlockManager.getBlockByType(ElementType.HTML_NODE).create({
      attributes: attrs,
      data: {
        tagName: tagName,
      },
      children: Array.from(node.childNodes).map((child) => getItemNode(child)),
    });
  }
  throw new Error("Invalid node");
};
