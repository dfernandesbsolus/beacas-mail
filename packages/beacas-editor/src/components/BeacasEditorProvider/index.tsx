import React, { useEffect, useMemo, useRef } from "react";
import { withHistory } from "slate-history";
import { Slate, useSlate, withReact } from "slate-react";

import { withBeacas } from "@beacas-editor/core/withBeacas";
import globalCss from "@beacas-editor/assets/global.scss?inline";

import { EmailEditorProps } from "@beacas-editor/typings";

import {
  EditorContextProvider,
  EditorPropsProvider,
  InteractProvider,
} from "@beacas-editor/contexts";
import { BeacasCore, PageElement } from "beacas-core";
import {
  useEditorContext,
  useEditorProps,
  useRefState,
} from "@beacas-editor/hooks";
import { Descendant } from "slate";

export interface MergetagItem {
  label: string;
  value: string;
  children?: MergetagItem[];
  selectable?: boolean;
}

export const BeacasEditorProvider = (props: EmailEditorProps) => {
  const { withEnhanceEditor } = props;

  const propsRef = useRefState(props);
  const lastDataRef = useRef<PageElement[] | null>(null);

  const editor = useMemo(() => {
    const props = propsRef.current;
    if (withEnhanceEditor) {
      return withEnhanceEditor(
        withBeacas(withHistory(withReact(props.editor)), props),
        props
      );
    }
    return withBeacas(withHistory(withReact(props.editor)), props);
  }, [propsRef, withEnhanceEditor]);

  // 只允许初始化一次，要修改 只能用 useEditorForm 的 reset
  const initialValue = useMemo(() => {
    if (lastDataRef.current) return lastDataRef.current;

    let pageBlock = props.initialValues.content;

    if (props.universalElementSetting) {
      pageBlock = BeacasCore.transformUniversalElements({
        content: props.initialValues.content,
        universalElements: props.universalElementSetting.elements,
      });
    }

    const children = [pageBlock];
    editor.children = children;
    lastDataRef.current = children;
    return children;
  }, [editor, props.initialValues.content, props.universalElementSetting]);

  const children = useMemo(() => props.children, [props.children]);

  const onPageChange = (value: Descendant[]) => {
    const pageData = value[0];
    props.onPageChange?.(pageData as PageElement, editor);
  };

  return (
    <Slate editor={editor} value={initialValue} onChange={onPageChange}>
      <EditorPropsProvider value={props}>
        <EditorContextProvider {...props}>
          <InteractProvider>
            <style>{globalCss}</style>
            {children}
          </InteractProvider>
          <ForceUpdateValue />
        </EditorContextProvider>
      </EditorPropsProvider>
    </Slate>
  );
};

const ForceUpdateValue = () => {
  const props = useEditorProps();
  const { values } = useEditorContext();
  const editor = useSlate();
  const valueRef = useRefState(values);

  useEffect(() => {
    let pageBlock = valueRef.current.content;

    if (props.universalElementSetting) {
      pageBlock = BeacasCore.transformUniversalElements({
        content: valueRef.current.content,
        universalElements: props.universalElementSetting.elements,
      });
    }
    editor.replaceNode({
      path: [0],
      node: pageBlock,
    });
  }, [editor, props.universalElementSetting, valueRef]);

  return null;
};
