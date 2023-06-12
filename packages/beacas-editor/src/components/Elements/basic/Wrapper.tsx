import { Section as AtomSection } from "../atom";
import React from "react";
import { BlockManager, ElementType, WrapperElement } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.WRAPPER);

export class Wrapper extends AtomSection<WrapperElement> {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  renderSection() {
    const hasBackground = this.hasBackground();

    const content = (
      <table
        {...this.htmlAttributes({
          align: "center",
          background: this.isFullWidth()
            ? null
            : this.getAttribute("background-url"),
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
              {...this.htmlAttributes({
                style: "td",
              })}
            >
              {this.renderChildrenWithPlaceholder()}
            </td>
          </tr>
        </tbody>
      </table>
    );

    return (
      <div
        {...this.htmlAttributes({
          class: this.isFullWidth() ? null : this.getAttribute("css-class"),
          style: "div",
        })}
      >
        {hasBackground ? (
          <div {...this.htmlAttributes({ style: "innerDiv" })}>{content}</div>
        ) : (
          content
        )}
      </div>
    );
  }

  renderFullWidth() {
    const content = <>{this.renderSection()}</>;
    return (
      <table
        {...this.htmlAttributes({
          align: "center",
          class: this.getAttribute("css-class"),
          background: this.getAttribute("background-url"),
          border: "0",
          cellpadding: "0",
          cellspacing: "0",
          role: "presentation",
          style: "tableFullwidth",
        })}
      >
        <tbody>
          <tr>
            <td>{content}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderElement() {
    return (
      <div
        data-slate-block={this.componentType}
        {...this.props.attributes}
        style={{
          maxWidth: this.props.context.attributes.width,
          margin: "auto",
        }}
      >
        {this.isFullWidth() ? this.renderFullWidth() : this.renderSimple()}
      </div>
    );
  }
}
