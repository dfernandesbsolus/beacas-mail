import { widthParser } from "@beacas-editor/utils/widthParser";
import React from "react";
import { GroupElement, Element, ElementType, BlockManager } from "beacas-core";
import { BaseElement } from "../BaseElement";
import { getMediaQuery } from "@beacas-editor/utils/getMediaQuery";

const block = BlockManager.getBlockByType(ElementType.GROUP);

export class Group<T extends Element = GroupElement> extends BaseElement<T> {
  componentType = "group";

  static allowedAttributes = {
    "background-color": "color",
    direction: "enum(ltr,rtl)",
    "vertical-align": "enum(top,bottom,middle)",
    width: "unit(px,%)",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  get containerWidth() {
    const parentWidth = this.parent.containerWidth;
    const { children } = this.props;
    const paddingSize =
      this.getShorthandAttrValue("padding", "left") +
      this.getShorthandAttrValue("padding", "right");

    let containerWidth =
      this.getAttribute("width") || `${parseFloat(parentWidth) / children}px`;

    const { unit, parsedWidth } = widthParser(containerWidth, {
      parseFloatToInt: false,
    });

    if (unit === "%") {
      containerWidth = `${
        (parseFloat(parentWidth) * parsedWidth) / 100 - paddingSize
      }px`;
    } else {
      containerWidth = `${parsedWidth - paddingSize}px`;
    }

    return containerWidth;
  }

  getStyles() {
    return {
      div: {
        "font-size": "0",
        "line-height": "0",
        "text-align": "left",
        display: "inline-block",
        width: "100%",
        direction: this.getAttribute("direction"),
        "vertical-align": this.getAttribute("vertical-align"),
        "background-color": this.getAttribute("background-color"),
      },
      tdOutlook: {
        "vertical-align": this.getAttribute("vertical-align"),
        width: this.getWidthAsPixel(),
      },
    };
  }

  getParsedWidth(toString?: boolean) {
    const { children } = this.props;

    const width = this.getAttribute("width") || `${100 / children}%`;

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

  getWidthAsPixel() {
    const { containerWidth } = this.parent;

    const { unit, parsedWidth } = widthParser(
      this.getParsedWidth(true) as any,
      {
        parseFloatToInt: false,
      }
    );

    if (unit === "%") {
      return `${(parseFloat(containerWidth) * parsedWidth) / 100}px`;
    }
    return `${parsedWidth}px`;
  }

  getColumnClassAndMediaQuery() {
    let className = "";

    const { parsedWidth, unit } = this.getParsedWidth() as {
      unit: string;
      parsedWidth: number;
    };
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
      mediaQuery: getMediaQuery(
        className,
        {
          parsedWidth,
          unit,
        },
        this.props.context.data.breakpoint
      ),
    };
  }

  getChildContainerWidth() {
    const { containerWidth: parentWidth } = this.parent;
    const { nonRawSiblings } = this;
    const paddingSize =
      this.getShorthandAttrValue("padding", "left") +
      this.getShorthandAttrValue("padding", "right");

    let containerWidth =
      this.getAttribute("width") ||
      `${parseFloat(parentWidth) / nonRawSiblings}px`;

    const { unit, parsedWidth } = widthParser(containerWidth, {
      parseFloatToInt: false,
    });

    if (unit === "%") {
      containerWidth = `${
        (parseFloat(parentWidth) * parsedWidth) / 100 - paddingSize
      }px`;
    } else {
      containerWidth = `${parsedWidth - paddingSize}px`;
    }

    return containerWidth;
  }

  renderElement() {
    const { className: columnClassName, mediaQuery } =
      this.getColumnClassAndMediaQuery();
    let classesName = `${columnClassName} mj-outlook-group-fix`;

    if (this.getAttribute("css-class")) {
      classesName += ` ${this.getAttribute("css-class")}`;
    }

    return (
      <div
        {...this.props.attributes}
        data-slate-block={this.componentType}
        {...this.htmlAttributes({
          class: classesName,
          style: "div",
        })}
      >
        {this.props.children}
        {mediaQuery}
      </div>
    );
  }
}
