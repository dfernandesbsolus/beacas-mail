import React from "react";
import {
  BeacasCore,
  BlockManager,
  ElementType,
  PageElement,
  PageTestingCss,
} from "beacas-core";
import { BaseElement } from "../BaseElement";

const block = BlockManager.getBlockByType(ElementType.PAGE);

export class Page<T extends PageElement = PageElement> extends BaseElement<T> {
  componentType = "page";

  static allowedAttributes = {
    width: "unit(px)",
    "background-color": "color",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getStyles() {
    return {
      div: {
        "background-color": this.getAttribute("background-color"),
      },
    };
  }

  getContainerWidth() {
    return this.getAttribute("width");
  }

  renderContent = () => {
    // 处理链接
    const linkAttributes: {
      color?: string;
      "font-weight"?: string;
      "text-decoration"?: string;
      "font-style"?: string;
    } = {
      color: this.attributes["link-color"]?.trim() || "inherit",
      "font-weight": this.attributes["link-font-weight"]?.trim(),
      "text-decoration":
        this.attributes["link-text-decoration"]?.trim() || "none",
      "font-style": this.attributes["link-font-style"]?.trim(),
    };

    const linkAttributesText = Object.keys(linkAttributes)
      .map((item) => {
        const map = linkAttributes as any;
        if (map[item]) return `${item}: ${map[item]}`;
        return "";
      })
      .filter(Boolean)
      .join(";");
    const linkStyle = `a {${linkAttributesText}} a:hover {${linkAttributesText}} a:active {${linkAttributesText}}`;

    const inlineStyles =
      this.props.element.data.globalStyles
        ?.filter((item) => item.inline)
        .map((item) => item.content)
        .join("\n") || "";
    const nonInlineStyle =
      this.props.element.data.globalStyles
        ?.filter((item) => !item.inline)
        .map((item) => item.content)
        .join("\n") || "";

    const fonts = this.props.element.data.fonts?.map((item, index) => {
      return (
        <link
          key={index}
          href={item.href}
          rel="stylesheet"
          type="text/css"
        ></link>
      );
    });

    const enabeledRemoveBranding =
      BeacasCore.getFeatures().includes("remove_branding");

    return (
      <>
        <style type="text/css">{linkStyle}</style>
        <style type="text/css">{nonInlineStyle}</style>
        <style type="text/css">{inlineStyles}</style>
        <style>
          {`

      #outlook a {
        padding: 0;
      }



      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table,
      td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      p {
        display: block;
        margin: 13px 0;
      }


      ${PageTestingCss}

      /* overwrite */
      body {
        background-color: ${this.props.element.attributes["background-color"]}
      }
      `}
        </style>
        {fonts}
        <div
          data-slate-block="page"
          {...this.props.attributes}
          style={{
            wordSpacing: "normal",
          }}
        >
          <div
            {...this.htmlAttributes({
              class: this.getAttribute("css-class"),
              style: "div",
            })}
          >
            <div
              style={{
                marginTop: this.getAttribute("margin-top"),
                marginBottom: this.getAttribute("margin-bottom"),
              }}
            >
              <div
                style={{
                  width: this.props.isMobileActive ? 375 : undefined,
                  margin: "auto",
                  boxSizing: "border-box",
                }}
              >
                {this.renderChildrenElement()}
                {!enabeledRemoveBranding && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<div style="max-width: 600px; margin: 0px auto;">

                      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;"><tbody><tr><td style="text-align: center; padding: 20px 0px; font-size: 0px; direction: ltr;"><!-- [if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif] --><div class="mj-column-per-100 mj-outlook-group-fix" style="width: 100%; vertical-align: top; display: inline-block; direction: ltr; text-align: left; font-size: 0px;">

                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="vertical-align: top;"><tbody><tr><td align="left" style="word-break: break-word; padding: 0px; font-size: 0px;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-spacing: 0px; border-collapse: collapse;"><tbody><tr><td style="width: 120px;"><a href="https://github.com/beacas-team/beacas-docs" target="_blank">

                    <img src="http://res.cloudinary.com/dfite2e16/image/upload/v1684680854/beacas/nskjh4vj59mijlbbc40q.png" width="120" height="auto" style="font-size: 13px; width: 100%; height: auto; text-decoration: none; outline: none; display: block; border: 0px;">

                      </a></td></tr></tbody></table></td></tr></tbody></table>

                    </div><!-- [if mso | IE]></td></tr></table><![endif] --></td></tr></tbody></table>

                    </div>`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  renderChildrenElement() {
    return <div>{this.renderChildrenWithPlaceholder()}</div>;
  }

  renderElement() {
    return <div>{this.renderContent()}</div>;
  }
}
