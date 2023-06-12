/* eslint-disable no-case-declarations */
import {
  Element as BascasElement,
  BasicElement,
  BlockManager,
  ElementType,
  PageElement,
} from "beacas-core";
import { isString } from "lodash";
import mjml from "mjml-browser";
import { MjmlBlockItem } from "./type";
import { HtmlNodeAdapter } from "./HtmlNodeAdapter";
import { basicElementToStandardElement } from "./basicElementToStandardElement";
import { formatPadding } from "./formatPadding";

export const mjmlToJson = (content: string): PageElement => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(content, "text/xml");
  const root = dom.firstChild as Element;

  if (root.tagName !== "mjml") {
    throw new Error("mjmlToJson: invalid mjml. First node must be mjml");
  }

  if (root.tagName === "mjml") {
    const { json } = mjml(content, {
      validationLevel: "soft",
    });
    const parseValue = mjmlTransform(json as MjmlBlockItem);
    return parseValue;
  }

  const transform = (node: Element): BasicElement => {
    if (node.tagName === "parsererror") {
      throw new Error("Invalid content");
    }
    const attributes: Record<string, string> = {};
    node.getAttributeNames().forEach((name) => {
      const value = node.getAttribute(name);
      if (isString(value)) {
        attributes[name] = value;
      }
    });
    const type = node.tagName.replace("mj-", "");

    if (!BlockManager.getBlockByType(type as BascasElement["type"])) {
      if (!node.parentElement || node.parentElement.tagName !== "mj-text")
        throw new Error("Invalid content");
    }

    const block: BasicElement = {
      type: type,
      attributes: attributes,
      data: {},
      children: [...node.children]
        .filter((item) => item instanceof Element)
        .map(transform as any),
    };

    switch (type) {
      case ElementType.TEXT:
        block.data.value.content = node.innerHTML;
        block.children = [];
    }

    return block;
  };

  return transform(root) as any;
};

function mjmlTransform(data: MjmlBlockItem): PageElement {
  const transform = (item: MjmlBlockItem): BascasElement => {
    const attributes = item.attributes as any;

    switch (item.tagName) {
      case "mjml":
        const body = item.children?.find((item) => item.tagName === "mj-body");
        if (!body) {
          throw new Error("Invalid content");
        }
        const head = item.children?.find((item) => item.tagName === "mj-head");

        const fonts =
          head?.children
            ?.filter((child) => child.tagName === "mj-font")
            .map((child) => ({
              name: child.attributes.name,
              href: child.attributes.href,
            })) || [];

        const headStyles = head?.children
          ?.filter((item) => item.tagName === "mj-style")
          .map((item) => ({
            content: item.content || "",
            inline: item.inline,
          }));

        const breakpoint = head?.children?.find(
          (item) => item.tagName === "mj-breakpoint"
        );
        const preheader = head?.children?.find(
          (item) => item.tagName === "mj-preview"
        );

        const page = BlockManager.getBlockByType(ElementType.PAGE).create({
          attributes: {
            "margin-top": "0px",
            "margin-bottom": "0px",
            ...body.attributes,
          },

          children: body.children?.map(transform),
          data: {
            headStyles: headStyles,
            fonts,
            breakpoint: breakpoint?.attributes.breakpoint,
            preheader: preheader?.content,
          },
        });

        const mjAttributes =
          head?.children?.find((item) => item.tagName === "mj-attributes")
            ?.children || [];

        mjAttributes.forEach((item) => {
          item = formatPadding(item);
          if (item.tagName === "mj-all") {
            page.data.globalAttributes = {
              ...page.data.globalAttributes,
              ...item.attributes,
            };
          } else if (item.tagName === "mj-class") {
            const name = item.attributes.name;
            delete item.attributes.name;
            page.data.classAttributes = {
              ...page.data.classAttributes,
              [name]: item.attributes,
            };
          } else {
            page.data.categoryAttributes = {
              ...page.data.categoryAttributes,
              [item.tagName.replace("mj-", "")]: item.attributes,
            };
          }
        });

        return page;

      default:
        const tag = item.tagName.replace("mj-", "").toLowerCase();

        const block = BlockManager.getBlockByType(tag as any);
        if (!block) {
          throw new Error(`${tag} block no found `);
        }
        const payload: BasicElement = {
          type: block.type,
          attributes: attributes,
          data: {},
          children: [],
        };

        switch (block.type) {
          case ElementType.TEXT:
          case ElementType.BUTTON:
          case ElementType.NAVBAR_LINK:
          case ElementType.SOCIAL_ELEMENT:
            payload.children = HtmlNodeAdapter(item.content || "");
            break;

          default:
            if (item.children) {
              payload.children = item.children.map(transform);
            }
        }

        if (payload.children.length === 0) {
          payload.children = [{ text: "" }];
        }

        const blockData = block.create(payload) as BascasElement;

        return basicElementToStandardElement(blockData);
    }
  };

  return transform(data) as PageElement;
}
