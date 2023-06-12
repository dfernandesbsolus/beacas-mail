import React from "react";
import {
  identity,
  omitBy,
  reduce,
  isNil,
  isString,
  camelCase,
  get,
  merge,
  memoize,
} from "lodash";
import { RenderElementProps } from "slate-react";
import { decode } from "he";
import { formatAttributes } from "@beacas-editor/utils/formatAttributes";
import {
  borderParser,
  shorthandParser,
} from "@beacas-editor/utils/shorthandParser";
import buildMediaQueriesTags from "@beacas-editor/utils/mediaQueries";
import { CustomSlateEditor } from "@beacas-editor/typings/custom-types";
import { classnames } from "@beacas-editor/utils/classnames";
import { BlockManager, Element, PageElement } from "beacas-core";

const BlockContext = React.createContext<{
  parent: BaseElement<any> | null;
}>({
  parent: null,
});

export type BaseElementProps<T extends Element> = Omit<
  RenderElementProps,
  "element"
> & {
  element: T;
  elementAttributes: T["attributes"];

  context: {
    data: PageElement["data"];
    attributes: PageElement["attributes"];
  };

  editor: CustomSlateEditor;
  placeholder?: React.ReactNode;
  isMobileActive: boolean;
};

export abstract class BaseElement<
  T extends Element
> extends React.PureComponent<BaseElementProps<T>> {
  defaultAttributes: Partial<T> = {};

  abstract componentType: string;

  static contextType = BlockContext;

  get mediaQueries(): { [prop: string]: string } {
    return {};
  }

  get attributes(): T["attributes"] {
    const constructor = this.constructor as any;

    const context = this.props.context.data;

    const classNames = classnames(
      context?.globalAttributes?.["mj-class"],
      context?.blockAttributes?.[this.props.element.type]?.["mj-class"],
      this.props.elementAttributes["mj-class"]
    );

    const classAttributes = {};

    Object.keys(context?.classAttributes || {}).forEach((value) => {
      const mjClassValues: string[] = classNames
        .split(" ")
        .map((item) => item.trim())
        .filter(Boolean);

      if (mjClassValues.includes(value)) {
        Object.assign(classAttributes, get(context?.classAttributes, value));
      }
    });

    const block = BlockManager.getBlockByType(this.props.element.type);
    const attributes = merge(
      {},
      constructor.defaultAttributes,
      context?.globalAttributes,
      context?.categoryAttributes?.[block.category],
      context?.blockAttributes?.[this.props.element.type],
      classAttributes,
      this.props.elementAttributes
    ) as Record<string, string>;

    return formatAttributes(
      attributes,
      constructor.allowedAttributes as Record<string, string>
    );
  }

  constructor(props: BaseElementProps<any>) {
    super(props);
  }

  get parent() {
    const parent = get(this, "context.parent") as BaseElement<any> | null;

    return parent!;
  }

  get parentElement() {
    return this.parent?.props.element;
  }

  get containerWidth(): string {
    return this.getAttribute("width") || this.parent.containerWidth;
  }

  getShorthandAttrValue(attribute: string, direction: string) {
    const mjAttributeDirection = this.getAttribute(`${attribute}-${direction}`);
    const mjAttribute = this.getAttribute(attribute);

    if (mjAttributeDirection) {
      return parseInt(mjAttributeDirection, 10);
    }

    if (!mjAttribute) {
      return 0;
    }

    return shorthandParser(mjAttribute, direction);
  }

  getShorthandBorderValue(direction: string) {
    const borderDirection =
      direction && this.getAttribute(`border-${direction}`);
    const border = this.getAttribute("border");

    return borderParser(borderDirection || border || "0");
  }

  getBoxWidths() {
    const { containerWidth } = this.parent;
    const parsedWidth = parseInt(containerWidth, 10);

    const paddings =
      this.getShorthandAttrValue("padding", "right") +
      this.getShorthandAttrValue("padding", "left");

    const borders =
      this.getShorthandBorderValue("right") +
      this.getShorthandBorderValue("left");

    return {
      totalWidth: parsedWidth,
      borders,
      paddings,
      box: parsedWidth - paddings - borders,
    };
  }

  get nonRawSiblings() {
    return this.parent.props.element.children.filter((child: any) => {
      return child.type !== "raw";
    }).length;
  }

  getStyles() {
    return {};
  }

  getAttribute(name: string): string {
    return (this.attributes as any)[name];
  }

  htmlAttributes = memoize(
    (attributes: Record<string, any> | string) => {
      const specialAttributes = {
        style: (v: string) => this.styles(v),
        default: identity,
      };

      const obj = reduce(
        omitBy(attributes, isNil),
        (output, v: any, name) => {
          const fn =
            name === "style"
              ? specialAttributes.style
              : specialAttributes.default;
          const value = fn(v);

          let property: string = name;
          if (name === "class") {
            property = "className";
          }
          if (name.startsWith("cell")) {
            property = camelCase(name.replace(/^cell(.*)$/, "cell_$1"));
          }

          property = camelCase(property);

          if (property === "verticalAlign") {
            property = "verticalalign";
          }
          return {
            ...output,
            [property]: isString(value) ? decode(value) : value,
          };
        },
        {}
      );
      return obj;
    },
    (data) => {
      return (
        JSON.stringify(this.props.element.attributes) +
        JSON.stringify(this.props.element.mobileAttributes) +
        JSON.stringify(this.props.element.type) +
        JSON.stringify(data) +
        JSON.stringify(this.props.context.data) +
        JSON.stringify(this.props.context.attributes) +
        JSON.stringify(this.parent?.props.element.data) +
        JSON.stringify(this.parent?.props.element.attributes)
      );
    }
  );

  styles(styles: string | Record<string, string>) {
    let stylesObject;

    if (styles) {
      if (typeof styles === "string") {
        stylesObject = get(this.getStyles(), styles);
      } else {
        stylesObject = styles;
      }
    }

    const map: Record<string, string> = {};
    for (const i in stylesObject) {
      if (stylesObject[i]) {
        map[camelCase(i)] = isString(stylesObject[i])
          ? decode(stylesObject[i])
          : stylesObject[i];
      }
    }
    return map;
  }

  getMediaQuery(): Record<string, string> {
    return [this.mediaQueries].reduce((obj, current) => {
      Object.assign(obj, current);
      return obj;
    }, {} as Record<string, string>);
  }

  getStyleText() {
    return buildMediaQueriesTags(
      this.props.context.data.breakpoint,
      this.getMediaQuery()
    );
  }

  renderElement(): React.ReactNode {
    throw new Error("Need to overwrite");
  }

  renderChildrenWithPlaceholder() {
    return (
      <>
        {this.props.children}
        {this.props.placeholder}
      </>
    );
  }

  get childContext() {
    return {
      parent: this as any,
    };
  }

  render(): React.ReactNode {
    return (
      <BlockContext.Provider value={this.childContext}>
        {this.renderElement()}
      </BlockContext.Provider>
    );
  }

  renderWithColumn = (children: React.ReactNode) => {
    return (
      <tr {...this.props.attributes} data-slate-block={this.componentType}>
        <td
          {...this.htmlAttributes({
            align: this.getAttribute("align"),
            "vertical-align": this.getAttribute("vertical-align"),
            class: this.getAttribute("css-class"),
            style: {
              background: this.getAttribute("container-background-color"),
              "font-size": "0px",
              padding: this.getAttribute("padding"),
              "padding-top": this.getAttribute("padding-top"),
              "padding-right": this.getAttribute("padding-right"),
              "padding-bottom": this.getAttribute("padding-bottom"),
              "padding-left": this.getAttribute("padding-left"),
              "word-break": "break-word",
            },
          })}
        >
          {children}
        </td>
      </tr>
    );
  };
}
