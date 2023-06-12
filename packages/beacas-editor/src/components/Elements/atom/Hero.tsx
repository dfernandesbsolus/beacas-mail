import { widthParser } from "@beacas-editor/utils/widthParser";
import { HeroElement, Element, ElementType, BlockManager } from "beacas-core";
import React from "react";
import { filter, flow, identity } from "lodash";

const makeBackgroundString = flow(filter, identity, (str: string[]) =>
  str.join(" ")
);

const block = BlockManager.getBlockByType(ElementType.HERO);

import { BaseElement } from "../BaseElement";

export class Hero<T extends Element = HeroElement> extends BaseElement<T> {
  componentType = "hero";

  static allowedAttributes = {
    mode: "string",
    height: "unit(px,%)",
    "background-url": "string",
    "background-width": "unit(px,%)",
    "background-height": "unit(px,%)",
    "background-position": "string",
    "border-radius": "string",
    "container-background-color": "color",
    "inner-background-color": "color",
    "inner-padding": "unit(px,%){1,4}",
    "inner-padding-top": "unit(px,%)",
    "inner-padding-left": "unit(px,%)",
    "inner-padding-right": "unit(px,%)",
    "inner-padding-bottom": "unit(px,%)",
    padding: "unit(px,%){1,4}",
    "padding-bottom": "unit(px,%)",
    "padding-left": "unit(px,%)",
    "padding-right": "unit(px,%)",
    "padding-top": "unit(px,%)",
    "background-color": "color",
    "vertical-align": "enum(top,bottom,middle)",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getParentContainerWidth() {
    const { containerWidth } = this.parent;
    const paddingSize =
      this.getShorthandAttrValue("padding", "left") +
      this.getShorthandAttrValue("padding", "right");

    let currentContainerWidth = `${parseFloat(containerWidth)}px`;

    const { unit, parsedWidth } = widthParser(currentContainerWidth, {
      parseFloatToInt: false,
    });

    if (unit === "%") {
      currentContainerWidth = `${
        (parseFloat(containerWidth) * parsedWidth) / 100 - paddingSize
      }px`;
    } else {
      currentContainerWidth = `${parsedWidth - paddingSize}px`;
    }

    return currentContainerWidth;
  }

  getStyles() {
    const { containerWidth } = this.parent;
    const backgroundRatio = Math.round(
      (parseInt(this.getAttribute("background-height"), 10) /
        parseInt(this.getAttribute("background-width"), 10)) *
        100
    );

    const width = this.getAttribute("background-width") || containerWidth;

    return {
      div: {
        margin: "0 auto",
        "max-width": containerWidth,
      },
      table: {
        width: "100%",
      },
      tr: {
        "vertical-align": "top",
      },
      "td-fluid": {
        width: `0.01%`,
        "padding-bottom": `${backgroundRatio}%`,
        "mso-padding-bottom-alt": "0",
      },
      hero: {
        ...this.getBackground(),
        "background-position": this.getAttribute("background-position"),
        "background-repeat": "no-repeat",
        "border-radius": this.getAttribute("border-radius"),
        padding: this.getAttribute("padding"),
        "padding-top": this.getAttribute("padding-top"),
        "padding-left": this.getAttribute("padding-left"),
        "padding-right": this.getAttribute("padding-right"),
        "padding-bottom": this.getAttribute("padding-bottom"),
        "vertical-align": this.getAttribute("vertical-align"),
      },
      "outlook-table": {
        width: containerWidth,
      },
      "outlook-td": {
        "line-height": 0,
        "font-size": 0,
        "mso-line-height-rule": "exactly",
      },
      "outlook-inner-table": {
        width: containerWidth,
      },
      "outlook-image": {
        border: "0",
        height: this.getAttribute("background-height"),
        "mso-position-horizontal": "center",
        position: "absolute",
        top: 0,
        width,
        "z-index": "-3",
      },
      "outlook-inner-td": {
        "background-color": this.getAttribute("inner-background-color"),
        padding: this.getAttribute("inner-padding"),
        "padding-top": this.getAttribute("inner-padding-top"),
        "padding-left": this.getAttribute("inner-padding-left"),
        "padding-right": this.getAttribute("inner-padding-right"),
        "padding-bottom": this.getAttribute("inner-padding-bottom"),
      },
      "inner-table": {
        width: "100%",
        margin: "0px",
      },
      "inner-div": {
        "background-color": this.getAttribute("inner-background-color"),
        float: this.getAttribute("align"),
        margin: "0px auto",
        width: this.getAttribute("width"),
      },
    };
  }

  getBackground = () => {
    return {
      "background-color": this.getAttribute("background-color"),
      "background-url": this.getAttribute("background-url"),
      "background-position": this.getAttribute("background-position"),
      "background-repeat": "no-repeat",
      "background-size": "cover",
    };
  };
  // makeBackgroundString([
  //   this.getAttribute("background-color"),
  //   ...(this.getAttribute("background-url")
  //     ? [
  //         `url('${this.getAttribute("background-url")}')`,
  //         "no-repeat",
  //         `${this.getAttribute("background-position")} / cover`,
  //       ]
  //     : []),
  // ]);

  renderContent() {
    return (
      <div
        {...this.htmlAttributes({
          align: this.getAttribute("align"),
          class: "mj-hero-content",
          style: "inner-div",
        })}
      >
        <table
          {...this.htmlAttributes({
            border: "0",
            cellpadding: "0",
            cellspacing: "0",
            role: "presentation",
            style: "inner-table",
          })}
        >
          <tbody>
            <tr>
              <td {...this.htmlAttributes({ style: "inner-td" })}>
                <table
                  {...this.htmlAttributes({
                    border: "0",
                    cellpadding: "0",
                    cellspacing: "0",
                    role: "presentation",
                    style: "inner-table",
                  })}
                >
                  <tbody>{this.props.children}</tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderMode() {
    const commonAttributes = {
      background: this.getAttribute("background-url"),
      style: "hero",
    };

    /* eslint-disable no-alert, no-case-declarations */
    switch (this.getAttribute("mode")) {
      case "fluid-height":
        const magicTd = this.htmlAttributes({ style: `td-fluid` });

        return (
          <>
            <td {...magicTd} />
            <td {...this.htmlAttributes({ ...commonAttributes })}>
              {this.renderContent()}
            </td>
            <td {...magicTd} />
          </>
        );
      case "fixed-height":
      default:
        const height =
          parseInt(this.getAttribute("height"), 10) -
          this.getShorthandAttrValue("padding", "top") -
          this.getShorthandAttrValue("padding", "bottom");

        return (
          <td
            {...this.htmlAttributes({
              ...commonAttributes,
              height: height.toString(),
            })}
          >
            {this.renderContent()}
          </td>
        );
    }
    /* eslint-enable no-alert, no-case-declarations */
  }

  renderElement() {
    return (
      <div
        data-slate-block={this.componentType}
        {...this.props.attributes}
        {...this.htmlAttributes({
          align: this.getAttribute("align"),
          class: this.getAttribute("css-class"),
          style: "div",
        })}
      >
        <table
          {...this.htmlAttributes({
            border: "0",
            cellpadding: "0",
            cellspacing: "0",
            role: "presentation",
            style: "table",
          })}
        >
          <tbody>
            <tr
              {...this.htmlAttributes({
                style: "tr",
              })}
            >
              {this.renderMode()}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
