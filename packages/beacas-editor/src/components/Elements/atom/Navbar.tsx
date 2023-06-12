import { makeLowerBreakpoint } from "@beacas-editor/utils/makeLowerBreakpoint";
import React from "react";
import { BlockManager, ElementType, NavbarElement } from "beacas-core";

import { BaseElement } from "../BaseElement";
import { uniqueId } from "lodash";

const block = BlockManager.getBlockByType(ElementType.NAVBAR);

export class Navbar extends BaseElement<NavbarElement> {
  componentType = "navbar";
  static allowedAttributes = {
    align: "enum(left,center,right)",
    "base-url": "string",
    hamburger: "string",
    "ico-align": "enum(left,center,right)",
    "ico-open": "string",
    "ico-close": "string",
    "ico-color": "color",
    "ico-font-size": "unit(px,%)",
    "ico-font-family": "string",
    "ico-text-transform": "string",
    "ico-padding": "unit(px,%){1,4}",
    "ico-padding-left": "unit(px,%)",
    "ico-padding-top": "unit(px,%)",
    "ico-padding-right": "unit(px,%)",
    "ico-padding-bottom": "unit(px,%)",
    padding: "unit(px,%){1,4}",
    "padding-left": "unit(px,%)",
    "padding-top": "unit(px,%)",
    "padding-right": "unit(px,%)",
    "padding-bottom": "unit(px,%)",
    "ico-text-decoration": "string",
    "ico-line-height": "unit(px,%,)",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  get headStyle() {
    return `
    noinput.mj-menu-checkbox { display:block!important; max-height:none!important; visibility:visible!important; }

    @media only screen and (max-width:${makeLowerBreakpoint(
      this.props.context.data.breakpoint
    )}) {
      .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links { display:none!important; }
      .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-inline-links,
      .mj-menu-checkbox[type="checkbox"] ~ .mj-menu-trigger { display:block!important; max-width:none!important; max-height:none!important; font-size:inherit!important; }
      .mj-menu-checkbox[type="checkbox"] ~ .mj-inline-links > a { display:block!important; }
      .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-close { display:block!important; }
      .mj-menu-checkbox[type="checkbox"]:checked ~ .mj-menu-trigger .mj-menu-icon-open { display:none!important; }
    }
  `;
  }
  getStyles() {
    return {
      div: {
        align: this.getAttribute("align"),
        width: "100%",
      },
      label: {
        display: "block",
        cursor: "pointer",
        "mso-hide": "all",
        "user-select": "none",
        color: this.getAttribute("ico-color"),
        "font-size": this.getAttribute("ico-font-size"),
        "font-family": this.getAttribute("ico-font-family"),
        "text-transform": this.getAttribute("ico-text-transform"),
        "text-decoration": this.getAttribute("ico-text-decoration"),
        "line-height": this.getAttribute("ico-line-height"),
        "padding-top": this.getAttribute("ico-padding-top"),
        "padding-right": this.getAttribute("ico-padding-right"),
        "padding-bottom": this.getAttribute("ico-padding-bottom"),
        "padding-left": this.getAttribute("ico-padding-left"),
        padding: this.getAttribute("ico-padding"),
      },
      trigger: {
        display: "none",
        "max-height": "0px",
        "max-width": "0px",
        "font-size": "0px",
        overflow: "hidden",
      },
      icoOpen: {
        "mso-hide": "all",
      },
      icoClose: {
        display: "none",
        "mso-hide": "all",
      },
    };
  }

  renderHamburger() {
    const key = uniqueId();

    return (
      <>
        <input
          type="checkbox"
          id={key}
          className="mj-menu-checkbox"
          style={{
            display: "none !important",
            maxHeight: 0,
            visibility: "hidden",
          }}
        />
        <div
          {...this.htmlAttributes({
            class: "mj-menu-trigger",
            style: "trigger",
          })}
        >
          <label
            {...this.htmlAttributes({
              htmlFor: key,
              class: "mj-menu-label",
              style: "label",
              align: this.getAttribute("ico-align"),
            })}
          >
            <span
              {...this.htmlAttributes({
                class: "mj-menu-icon-open",
                style: "icoOpen",
              })}
              dangerouslySetInnerHTML={{
                __html: this.getAttribute("ico-open"),
              }}
            />
            <span
              {...this.htmlAttributes({
                class: "mj-menu-icon-close",
                style: "icoClose",
              })}
              dangerouslySetInnerHTML={{
                __html: this.getAttribute("ico-close"),
              }}
            />
          </label>
          <style>{this.headStyle}</style>
        </div>
      </>
    );
  }

  get navbarBaseUrl() {
    return this.getAttribute("base-url");
  }

  renderElement() {
    return this.renderWithColumn(
      <>
        {this.getAttribute("hamburger") === "hamburger"
          ? this.renderHamburger()
          : ""}
        <div
          {...this.htmlAttributes({
            class: "mj-inline-links",
            style: "div",
          })}
        >
          {this.renderChildrenWithPlaceholder()}
        </div>
      </>
    );
  }
}
