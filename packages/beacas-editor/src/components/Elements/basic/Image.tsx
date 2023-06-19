import React from "react";
import { Image as AtomImage } from "../atom";
import imagePlaceholder from "@beacas-editor/assets/images/image-placeholder.png";

import { NodeUtils, BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.IMAGE);

export class Image extends AtomImage {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getAttribute(name: string): string {
    if (name === "src") {
      const url = this.attributes["src"]?.trim();
      if (!url) {
        return imagePlaceholder;
      }
      if (NodeUtils.isMergeTag(url)) {
        return imagePlaceholder;
      }
    }
    return (this.attributes as any)[name];
  }

  renderElement() {
    const isEmpty = !this.props.element.attributes["src"]?.trim();
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
        {...{
          ["data-empty-src"]: isEmpty,
        }}
      >
        <tbody>
          <tr>
            <td
              {...this.htmlAttributes({
                style: "td",
                class: this.getAttribute("fluid-on-mobile")
                  ? "mj-full-width-mobile"
                  : null,
              })}
            >
              {this.renderImage()}
            </td>
          </tr>
        </tbody>
        <style>{this.headStyle}</style>
      </table>
    );
  }
}
