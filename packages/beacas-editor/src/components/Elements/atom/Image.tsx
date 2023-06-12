import { makeLowerBreakpoint } from "@beacas-editor/utils/makeLowerBreakpoint";
import { widthParser } from "@beacas-editor/utils/widthParser";
import { ImageElement, Element, ElementType, BlockManager } from "beacas-core";
import { min } from "lodash";
import React from "react";

const block = BlockManager.getBlockByType(ElementType.GROUP);

import { BaseElement } from "../BaseElement";
export class Image<T extends Element = ImageElement> extends BaseElement<T> {
  componentType = "image";

  static allowedAttributes = {
    alt: "string",
    href: "string",
    name: "string",
    src: "string",
    srcset: "string",
    sizes: "string",
    title: "string",
    rel: "string",
    align: "enum(left,center,right)",
    border: "string",
    "border-bottom": "string",
    "border-left": "string",
    "border-right": "string",
    "border-top": "string",
    "border-radius": "unit(px,%){1,4}",
    "container-background-color": "color",
    "fluid-on-mobile": "boolean",
    padding: "unit(px,%){1,4}",
    "padding-bottom": "unit(px,%)",
    "padding-left": "unit(px,%)",
    "padding-right": "unit(px,%)",
    "padding-top": "unit(px,%)",
    target: "string",
    width: "unit(px)",
    height: "unit(px,auto)",
    "max-height": "unit(px,%)",
    "font-size": "unit(px)",
    usemap: "string",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getStyles() {
    const width = this.getContentWidth()!;
    const fullWidth = this.getAttribute("full-width") === "full-width";

    const { parsedWidth, unit } = widthParser(width);

    return {
      img: {
        border: this.getAttribute("border"),
        "border-left": this.getAttribute("border-left"),
        "border-right": this.getAttribute("border-right"),
        "border-top": this.getAttribute("border-top"),
        "border-bottom": this.getAttribute("border-bottom"),
        "border-radius": this.getAttribute("border-radius"),
        display: "block",
        outline: "none",
        "text-decoration": "none",
        height: this.getAttribute("height"),
        "max-height": this.getAttribute("max-height"),
        "min-width": fullWidth ? "100%" : null,
        width: "100%",
        "max-width": fullWidth ? "100%" : null,
        "font-size": this.getAttribute("font-size"),
      },
      td: {
        width: fullWidth ? null : `${parsedWidth}${unit}`,
        position: "relative",
      },
      table: {
        "min-width": fullWidth ? "100%" : null,
        "max-width": fullWidth ? "100%" : null,
        width: fullWidth ? `${parsedWidth}${unit}` : null,
        "border-collapse": "collapse",
        "border-spacing": "0px",
      },
    };
  }

  getContentWidth() {
    const width = this.getAttribute("width")
      ? parseInt(this.getAttribute("width"), 10)
      : Infinity;

    const { box } = this.getBoxWidths();

    return min([box, width]);
  }

  renderImage() {
    const height = this.getAttribute("height");

    const img = (
      <>
        <img
          {...this.htmlAttributes({
            alt: this.getAttribute("alt"),
            height:
              height && (height === "auto" ? height : parseInt(height, 10)),
            src: this.getAttribute("src"),
            srcset: this.getAttribute("srcset"),
            sizes: this.getAttribute("sizes"),
            style: "img",
            title: this.getAttribute("title"),
            width: this.getContentWidth(),
            usemap: this.getAttribute("usemap"),
          })}
        />
        {this.renderChildrenWithPlaceholder()}
      </>
    );

    if (this.getAttribute("href")) {
      return (
        <a
          {...this.htmlAttributes({
            href: this.getAttribute("href"),
            target: this.getAttribute("target"),
            rel: this.getAttribute("rel"),
            name: this.getAttribute("name"),
            title: this.getAttribute("title"),
          })}
        >
          {img}
        </a>
      );
    }

    return img;
  }

  get headStyle() {
    return `
    @media only screen and (max-width:${makeLowerBreakpoint(
      this.props.context.data.breakpoint
    )}) {
      table.mj-full-width-mobile { width: 100% !important; }
      td.mj-full-width-mobile { width: auto !important; }
    }
  `;
  }

  renderElement(): React.ReactNode {
    const attributes = this.htmlAttributes({
      style: "td",
      class: this.getAttribute("fluid-on-mobile")
        ? "mj-full-width-mobile"
        : null,
    }) as any;

    attributes.style = {
      ...attributes.style,
      positon: "relative",
    };

    return this.renderWithColumn(
      <table
        {...this.htmlAttributes({
          border: "0",
          cellpadding: "0",
          cellspacing: "0",
          role: "presentation",
          style: "table",
          class: this.getAttribute("fluid-on-mobile")
            ? "mj-full-width-mobile"
            : null,
        })}
      >
        <tbody>
          <tr>
            <td {...attributes}>{this.renderImage()}</td>
          </tr>
        </tbody>
        <style>{this.headStyle}</style>
      </table>
    );
  }
}
