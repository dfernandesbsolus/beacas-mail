import { HtmlNodeElement } from "beacas-core";
import { createElement } from "react";
import { BaseElement } from "../BaseElement";

import { BlockManager, ElementType } from "beacas-core";
import { camelCase, get } from "lodash";

function getStyle(styleText: string | null) {
  if (!styleText) return undefined;
  return styleText.split(";").reduceRight((a: any, b: any) => {
    const arr = b.split(/\:(?!\/)/);
    if (arr.length < 2) return a;
    a[camelCase(arr[0])] = arr[1];
    return a;
  }, {});
}

const block = BlockManager.getBlockByType(ElementType.HTML_NODE);

export class HtmlNode extends BaseElement<HtmlNodeElement> {
  componentType = "HtmlNode";

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  renderElement() {
    const element = this.props.element;

    return createElement(
      element.data.tagName,
      {
        ...this.props.attributes,
        ...element.attributes,
        style: getStyle(get(element, "attributes.style", "")),
      },
      this.props.children
    );
  }
}
