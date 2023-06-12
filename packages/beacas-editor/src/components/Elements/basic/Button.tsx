import React from "react";
import { Button as AtomButton } from "../atom";
import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.BUTTON);

export class Button extends AtomButton {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  renderElement() {
    const isLink = Boolean(this.getAttribute("href"));

    const tdAttributes = {
      ...this.htmlAttributes({
        align: "center",
        bgcolor:
          this.getAttribute("background-color") === "none"
            ? undefined
            : this.getAttribute("background-color"),
        role: "presentation",
        style: "td",
        valign: this.getAttribute("vertical-align"),
      }),
    } as any;

    return this.renderWithColumn(
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
          <tr>
            <td
              {...tdAttributes}
              style={{ ...tdAttributes?.style, position: "relative" }}
            >
              {isLink ? (
                <a
                  {...this.htmlAttributes({
                    href: this.getAttribute("href"),
                    name: this.getAttribute("name"),
                    rel: this.getAttribute("rel"),
                    title: this.getAttribute("title"),
                    style: "content",
                    target: this.getAttribute("target"),
                  })}
                >
                  {this.renderChildrenWithPlaceholder()}
                </a>
              ) : (
                <p
                  {...this.htmlAttributes({
                    href: this.getAttribute("href"),
                    name: this.getAttribute("name"),
                    rel: this.getAttribute("rel"),
                    title: this.getAttribute("title"),
                    style: "content",
                    target: undefined,
                  })}
                >
                  {this.renderChildrenWithPlaceholder()}
                </p>
              )}
              {/* <BlockResizer
                element={this.props.element}
                bottom
                left
                right
                horizontalScale={2}
              /> */}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
