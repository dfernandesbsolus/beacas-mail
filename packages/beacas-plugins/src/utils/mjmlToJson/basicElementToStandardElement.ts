import { BasicElement, Element, ElementType } from "beacas-core";
import { formatPadding } from "./formatPadding";

export function basicElementToStandardElement(element: Element): Element {
  const standardType = "standard-" + element.type;

  switch (element.type) {
    case ElementType.WRAPPER:
    case ElementType.HERO:
    case ElementType.SECTION:
    case ElementType.GROUP:
    case ElementType.COLUMN:
    case ElementType.TEXT:
    case ElementType.BUTTON:
    case ElementType.IMAGE:
    case ElementType.NAVBAR:
    case ElementType.SOCIAL:
    case ElementType.SPACER:
    case ElementType.SOCIAL_ELEMENT:
    case ElementType.NAVBAR_LINK:
      const standardElement = { ...element } as BasicElement;
      if (
        ([ElementType.HERO, ElementType.SECTION] as string[]).includes(
          element.type
        )
      ) {
        standardElement.attributes["background-image-enabled"] = true;
      }
      if (
        (
          [
            ElementType.BUTTON,
            ElementType.IMAGE,
            ElementType.SECTION,
          ] as string[]
        ).includes(element.type)
      ) {
        if (
          (standardElement.attributes["border"] &&
            standardElement.attributes["border"].trim() !== "none") ||
          standardElement.attributes["border-width"]
        ) {
          standardElement.attributes["border-enabled"] = true;
        }
      }

      return {
        ...formatPadding(element),
        type: standardType,
      } as Element;
  }

  return element;
}
