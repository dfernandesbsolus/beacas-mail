import { useEditorContext, useEditorProps } from "beacas-editor";
import React, { useMemo } from "react";

const defaultFontList = [
  "Arial",
  "Tahoma",
  "Verdana",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Lato",
  "Montserrat",
  "黑体",
  "仿宋",
  "楷体",
  "标楷体",
  "华文仿宋",
  "华文楷体",
  "宋体",
  "微软雅黑",
].map((item) => ({ value: item, label: item }));

export function useFontFamily() {
  const { fontList: propsFontList } = useEditorProps();
  const { values } = useEditorContext();

  const addFonts = values.content.data.fonts;

  const fontList = useMemo(() => {
    const fonts: Array<{
      value: string;
      label: React.ReactNode;
    }> = [];
    if (propsFontList) {
      fonts.push(...propsFontList);
    } else {
      fonts.push(...defaultFontList);
    }
    if (addFonts) {
      const options = addFonts.map((item) => ({
        value: item.name,
        label: item.name,
      }));
      fonts.unshift(...options);
    }

    return fonts.map((item) => ({
      value: item.value,
      label: <span style={{ fontFamily: item.value }}>{item.label}</span>,
    }));
  }, [addFonts, propsFontList]);

  return {
    fontList,
  };
}
