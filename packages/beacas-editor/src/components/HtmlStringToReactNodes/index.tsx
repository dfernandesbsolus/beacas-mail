import React, { useEffect, useState } from "react";
import * as htmlParser from "parse5";
import { camelCase } from "lodash";

export interface HtmlStringToReactNodesOptions {
  enabledMergeTagsBadge: boolean;
}

export function HtmlStringToReactNodes({
  content,
  domAttributes,
  children,
}: {
  content: string;
  domAttributes?: any;
  children?: React.ReactNode;
}) {
  if (!content) {
    return null;
  }
  const htmlAST = htmlParser.parseFragment(content);

  if (htmlAST.childNodes.length === 0) {
    return null;
  }

  const result = htmlAST.childNodes.map((item, index) => (
    <RenderNode
      node={item}
      key={index}
      domAttributes={domAttributes}
      children={children}
    />
  ));

  return <>{result.length === 1 ? result[0] : result}</>;
}
function RenderNode(props: {
  node: any;
  domAttributes?: any;
  children?: React.ReactNode;
}) {
  const { node, domAttributes, children } = props;
  if (node.nodeName === "#text") {
    if (
      ["table", "tbody", "tr", "td"].includes(node.parentNode?.nodeName) &&
      node.value.trim() === ""
    ) {
      return null;
    }
    return node.value;
  }

  if (node.nodeName === "#comment") {
    return null;
    // return <CommentElement text={node.data} />;
  }

  const attributes: Record<string, any> = {
    ...domAttributes,
  };

  node.attrs.forEach((attr: { name: string; value: string }) => {
    let property = attr.name;

    if (property === "class" || property === "classname") {
      property = "className";
    }
    if (property === "for") {
      property = "htmlFor";
    }

    if (property.startsWith("cell")) {
      property = camelCase(property.replace(/^cell(.*)$/, "cell_$1"));
    }

    property = camelCase(property);

    if (property === "verticalAlign") {
      property = "verticalalign";
    }
    attributes[property] = attr.value;
    if (property === "style") {
      attributes[property] = getStyle(attr.value);
    }
  });

  const childNodes = node.childNodes as any[];

  if (childNodes.length === 0) {
    return React.createElement(node.tagName, attributes);
  }

  if (node.nodeName === "script") {
    attributes.dangerouslySetInnerHTML = { __html: childNodes[0].value };
    return React.createElement("script", attributes);
  }

  return React.createElement(
    node.tagName,
    attributes,
    <>
      {childNodes.map((item, index) => (
        <RenderNode node={item} key={index} />
      ))}
      {children}
    </>
  );
}

function getStyle(styleText: string | null) {
  if (!styleText) return undefined;
  return styleText.split(";").reduceRight((a: any, b: any) => {
    const arr = b.split(/\:(?!\/)/);
    if (arr.length < 2) return a;
    let key = arr[0];
    if (String(key) === "-moz-user-select") {
      key = "MozUserSelect";
      a[key] = arr[1];
    } else {
      a[camelCase(key)] = arr[1];
    }
    if (a.padding) {
      let div = document.createElement("div");
      div.style.padding = a.padding;
      div.style.paddingTop = a.paddingTop;
      div.style.paddingBottom = a.paddingBottom;
      div.style.paddingLeft = a.paddingLeft;
      div.style.paddingRight = a.paddingRight;
      a.padding = div.style.padding;
    }
    return a;
  }, {});
}

const CommentElement = (props: { text: string }) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (ref) {
      ref.outerHTML = `<!-- ${props.text} -->`;
    }
  }, [props.text, ref]);

  return <span className="comment" ref={setRef} />;
};
