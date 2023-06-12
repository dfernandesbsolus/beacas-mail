import { get } from "lodash";
import React from "react";
import { BlockManager, Element, ElementType } from "beacas-core";

import { BaseElement } from "../BaseElement";
const block = BlockManager.getBlockByType(ElementType.NAVBAR_LINK);

export class NavbarLink extends BaseElement<Element> {
  static endingTag = true;
  componentType = "navbarlink";
  static allowedAttributes = {
    color: "color",
    "font-family": "string",
    "font-size": "unit(px)",
    "font-style": "string",
    "font-weight": "string",
    href: "string",
    name: "string",
    target: "string",
    rel: "string",
    "letter-spacing": "unitWithNegative(px,em)",
    "line-height": "unit(px,%,)",
    "padding-bottom": "unit(px,%)",
    "padding-left": "unit(px,%)",
    "padding-right": "unit(px,%)",
    "padding-top": "unit(px,%)",
    padding: "unit(px,%){1,4}",
    "text-decoration": "string",
    "text-transform": "string",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getStyles() {
    return {
      a: {
        display: "inline-block",
        color: this.getAttribute("color"),
        "font-family": this.getAttribute("font-family"),
        "font-size": this.getAttribute("font-size"),
        "font-style": this.getAttribute("font-style"),
        "font-weight": this.getAttribute("font-weight"),
        "letter-spacing": this.getAttribute("letter-spacing"),
        "line-height": this.getAttribute("line-height"),
        "text-decoration": this.getAttribute("text-decoration"),
        "text-transform": this.getAttribute("text-transform"),
        padding: this.getAttribute("padding"),
        "padding-top": this.getAttribute("padding-top"),
        "padding-left": this.getAttribute("padding-left"),
        "padding-right": this.getAttribute("padding-right"),
        "padding-bottom": this.getAttribute("padding-bottom"),
      },
      td: {
        padding: this.getAttribute("padding"),
        "padding-top": this.getAttribute("padding-top"),
        "padding-left": this.getAttribute("padding-left"),
        "padding-right": this.getAttribute("padding-right"),
        "padding-bottom": this.getAttribute("padding-bottom"),
      },
    };
  }

  get isHorizontal() {
    return Boolean(get(this.parent, "isHorizontal"));
  }

  renderContent() {
    const href = this.getAttribute("href");
    const navbarBaseUrl = this.parent.getAttribute("navbarBaseUrl");
    const link = navbarBaseUrl ? `${navbarBaseUrl}${href}` : href;

    const cssClass = this.getAttribute("css-class")
      ? ` ${this.getAttribute("css-class")}`
      : "";
    return (
      <a
        {...this.htmlAttributes({
          class: `mj-link${cssClass}`,
          href: link,
          rel: this.getAttribute("rel"),
          target: this.getAttribute("target"),
          name: this.getAttribute("name"),
          style: "a",
        })}
      >
        {this.renderChildrenWithPlaceholder()}
      </a>
    );
  }

  renderElement() {
    return this.isHorizontal ? (
      <table
        {...this.htmlAttributes({
          align: this.parent.getAttribute("align"),
          border: "0",
          cellpadding: "0",
          cellspacing: "0",
          role: "presentation",
          style: {
            float: "none",
            display: "inline-table",
          },
        })}
      >
        <tbody>{this.renderContent()}</tbody>
      </table>
    ) : (
      this.renderContent()
    );
  }
}
