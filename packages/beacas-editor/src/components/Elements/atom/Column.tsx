import { generateMediaQuery } from "@beacas-editor/utils/generateMediaQuery";
import { widthParser } from "@beacas-editor/utils/widthParser";
import React from "react";
import { ColumnElement, Element } from "beacas-core";
import { BaseElement } from "../BaseElement";

import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.COLUMN);

export class Column<T extends Element = ColumnElement> extends BaseElement<T> {
  componentType = "column";

  static allowedAttributes = {
    "background-color": "color",
    border: "string",
    "border-bottom": "string",
    "border-left": "string",
    "border-radius": "unit(px,%){1,4}",
    "border-right": "string",
    "border-top": "string",
    direction: "enum(ltr,rtl)",
    "inner-background-color": "color",
    "padding-bottom": "unit(px,%)",
    "padding-left": "unit(px,%)",
    "padding-right": "unit(px,%)",
    "padding-top": "unit(px,%)",
    "inner-border": "string",
    "inner-border-bottom": "string",
    "inner-border-left": "string",
    "inner-border-radius": "unit(px,%){1,4}",
    "inner-border-right": "string",
    "inner-border-top": "string",
    padding: "unit(px,%){1,4}",
    "vertical-align": "enum(top,bottom,middle)",
    width: "unit(px,%)",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  get containerWidth() {
    const { containerWidth: parentWidth } = this.parent;
    const { nonRawSiblings } = this;
    const { borders, paddings } = this.getBoxWidths();
    const innerBorders =
      this.getShorthandAttrValue("inner-border", "left") +
      this.getShorthandAttrValue("inner-border", "right");

    const allPaddings = paddings + borders + innerBorders;

    let containerWidth =
      this.getAttribute("width") ||
      `${parseFloat(parentWidth) / nonRawSiblings}px`;
    const { unit, parsedWidth } = widthParser(containerWidth, {
      parseFloatToInt: false,
    });

    if (unit === "%") {
      containerWidth = `${
        (parseFloat(parentWidth) * parsedWidth) / 100 - allPaddings
      }px`;
    } else {
      containerWidth = `${parsedWidth - allPaddings}px`;
    }

    return containerWidth;
  }

  getStyles() {
    const tableStyle = {
      "background-color": this.getAttribute("background-color"),
      border: this.getAttribute("border"),
      "border-bottom": this.getAttribute("border-bottom"),
      "border-left": this.getAttribute("border-left"),
      "border-radius": this.getAttribute("border-radius"),
      "border-right": this.getAttribute("border-right"),
      "border-top": this.getAttribute("border-top"),
      "vertical-align": this.getAttribute("vertical-align"),
    };

    return {
      div: {
        "font-size": "0px",
        "text-align": "left",
        direction: this.getAttribute("direction"),
        display: "inline-block",
        "vertical-align": this.getAttribute("vertical-align"),
        width: this.getMobileWidth(),
      },
      table: {
        ...(this.hasGutter()
          ? {
              "background-color": this.getAttribute("inner-background-color"),
              border: this.getAttribute("inner-border"),
              "border-bottom": this.getAttribute("inner-border-bottom"),
              "border-left": this.getAttribute("inner-border-left"),
              "border-radius": this.getAttribute("inner-border-radius"),
              "border-right": this.getAttribute("inner-border-right"),
              "border-top": this.getAttribute("inner-border-top"),
            }
          : tableStyle),
      },
      tdOutlook: {
        "vertical-align": this.getAttribute("vertical-align"),
        width: this.getWidthAsPixel(),
      },
      gutter: {
        ...tableStyle,
        padding: this.getAttribute("padding"),
        "padding-top": this.getAttribute("padding-top"),
        "padding-right": this.getAttribute("padding-right"),
        "padding-bottom": this.getAttribute("padding-bottom"),
        "padding-left": this.getAttribute("padding-left"),
      },
    };
  }

  getMobileWidth() {
    const { containerWidth } = this.parent;

    const { nonRawSiblings } = this;
    const width = this.getAttribute("width");

    if ((this.context as any)?.stackOnMobile) {
      return "100%";
    }
    if (width === undefined) {
      return `${parseInt((100 / nonRawSiblings).toString(), 10)}%`;
    }

    const { unit, parsedWidth } = widthParser(width, {
      parseFloatToInt: false,
    });

    switch (unit) {
      case "%":
        return width;
      case "px":
      default:
        return `${parsedWidth / parseInt(containerWidth, 10)}%`;
    }
  }

  getWidthAsPixel() {
    const { containerWidth } = this.parent;

    const { unit, parsedWidth } = widthParser(this.getParsedWidth(true), {
      parseFloatToInt: false,
    });

    if (unit === "%") {
      return `${(parseFloat(containerWidth) * parsedWidth) / 100}px`;
    }
    return `${parsedWidth}px`;
  }

  getParsedWidth(): {
    unit: string;
    parsedWidth: number;
  };
  getParsedWidth(toString: boolean): string;
  getParsedWidth(toString?: boolean) {
    const { nonRawSiblings } = this;

    const width = this.getAttribute("width") || `${100 / nonRawSiblings}%`;
    const { unit, parsedWidth } = widthParser(width, {
      parseFloatToInt: false,
    });

    if (toString) {
      return `${parsedWidth}${unit}`;
    }

    return {
      unit,
      parsedWidth,
    };
  }

  getColumnClass() {
    let className = "";

    const { parsedWidth, unit } = this.getParsedWidth();
    const formattedClassNb = parsedWidth.toString().replace(".", "-");

    switch (unit) {
      case "%":
        className = `mj-column-per-${formattedClassNb}`;
        break;

      case "px":
      default:
        className = `mj-column-px-${formattedClassNb}`;
        break;
    }

    return {
      className,
      parsedWidth,
      unit,
    };
  }

  get mediaQueries() {
    const data = this.getColumnClass();
    return generateMediaQuery(data.className, {
      parsedWidth: data.parsedWidth,
      unit: data.unit,
    });
  }

  hasGutter() {
    return [
      "padding",
      "padding-bottom",
      "padding-left",
      "padding-right",
      "padding-top",
    ].some((attr) => this.getAttribute(attr) != null);
  }

  renderGutter() {
    return (
      <table
        {...this.htmlAttributes({
          border: "0",
          cellpadding: "0",
          cellspacing: "0",
          role: "presentation",
          width: "100%",
        })}
      >
        <tbody>
          <tr>
            <td {...this.htmlAttributes({ style: "gutter" })}>
              {this.renderColumn()}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderColumn() {
    return (
      <table
        {...this.htmlAttributes({
          border: "0",
          cellpadding: "0",
          cellspacing: "0",
          role: "presentation",
          style: "table",
          width: "100%",
        })}
      >
        <tbody>{this.renderChildrenWithPlaceholder()}</tbody>
      </table>
    );
  }

  renderElement() {
    let classesName = `${this.getColumnClass().className} mj-outlook-group-fix`;

    if (this.getAttribute("css-class")) {
      classesName += ` ${this.getAttribute("css-class")}`;
    }

    return (
      <div
        {...this.props.attributes}
        {...this.htmlAttributes({
          class: classesName,
          style: "div",
        })}
        data-slate-block={this.componentType}
      >
        {this.hasGutter() ? this.renderGutter() : this.renderColumn()}
        <style>{this.getStyleText()}</style>
      </div>
    );
  }
}
