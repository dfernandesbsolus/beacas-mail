import { get } from "lodash";

export const formatPadding = <T extends Record<string, any>>(element: T) => {
  if (element.attributes.padding) {
    const div = document.createElement("div");
    div.style.padding = get(element.attributes, "padding")!;

    if (get(element.attributes, "padding-top")) {
      div.style.paddingTop = get(element.attributes, "padding-top")!;
    }
    if (get(element.attributes, "padding-bottom")) {
      div.style.paddingTop = get(element.attributes, "padding-bottom")!;
    }
    if (get(element.attributes, "padding-left")) {
      div.style.paddingTop = get(element.attributes, "padding-left")!;
    }
    if (get(element.attributes, "padding-right")) {
      div.style.paddingTop = get(element.attributes, "padding-right")!;
    }
    delete element.attributes.padding;

    element.attributes["padding-top"] = div.style.paddingTop;
    element.attributes["padding-bottom"] = div.style.paddingBottom;
    element.attributes["padding-left"] = div.style.paddingLeft;
    element.attributes["padding-right"] = div.style.paddingRight;
  }

  if (element.attributes["inner-padding"]) {
    const div = document.createElement("div");
    div.style.padding = get(element.attributes, "inner-padding")!;

    if (get(element.attributes, "inner-padding-top")) {
      div.style.paddingTop = get(element.attributes, "inner-padding-top")!;
    }
    if (get(element.attributes, "inner-padding-bottom")) {
      div.style.paddingTop = get(element.attributes, "inner-padding-bottom")!;
    }
    if (get(element.attributes, "inner-padding-left")) {
      div.style.paddingTop = get(element.attributes, "inner-padding-left")!;
    }
    if (get(element.attributes, "inner-padding-right")) {
      div.style.paddingTop = get(element.attributes, "inner-padding-right")!;
    }
    delete element.attributes["inner-padding"];

    element.attributes["inner-padding-top"] = div.style.paddingTop;
    element.attributes["inner-padding-bottom"] = div.style.paddingBottom;
    element.attributes["inner-padding-left"] = div.style.paddingLeft;
    element.attributes["inner-padding-right"] = div.style.paddingRight;
  }
  return element;
};
