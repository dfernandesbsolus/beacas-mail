import { BeacasCore, PageElement } from "beacas-core";
import { cloneDeep, isEqual } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createContext } from "react";
import { ReactEditor, useSlate } from "slate-react";
import {
  EmailEditorProps,
  EmailTemplate,
  useEditorProps,
  useRefState,
} from "..";

export interface EditorContextProps {
  values: EmailTemplate;
  pageDataVariables: NonNullable<PageElement["data"]["variables"]>;
  setValues: React.Dispatch<
    React.SetStateAction<Omit<EmailTemplate, "content">>
  >;
  inited: boolean;
  mergetagsData: Record<string, any>;
  setMergetagsData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  submit: () => void;
  dirty: boolean;
  initialValues: EmailTemplate;
  initialValuesRef: React.MutableRefObject<EmailTemplate>;
}

export const EditorContext = createContext<EditorContextProps>({} as any);

const getInited = (editor: ReactEditor) => {
  let inited = false;

  try {
    inited = Boolean(
      ReactEditor.getWindow(editor).document.querySelector(
        '[data-slate-editor="true"]'
      )
    );
  } catch (error) {}
  return inited;
};

export const EditorContextProvider: React.FC<EmailEditorProps> = (props) => {
  const editor = useSlate();
  const [hasAuth, setHasAuth] = useState(false);
  const [values, setValues] = useState<Omit<EmailTemplate, "content">>(
    props.initialValues
  );
  const { loading } = useEditorProps();
  const [mergetagsData, setMergetagsData] = useState<
    EditorContextProps["mergetagsData"]
  >({});
  const initialValuesRef = useRef(props.initialValues);

  const mergetagsDataRef = useRefState(mergetagsData);
  const [inited, setInited] = useState(false);

  useEffect(() => {
    if (isEqual(props.mergetagsData, mergetagsDataRef.current)) return;
    setMergetagsData(cloneDeep(props.mergetagsData) || {});
  }, [mergetagsDataRef, props.mergetagsData]);

  const pageElement = editor.children[0] as PageElement;

  useEffect(() => {
    const timer = setInterval(() => {
      const inited = getInited(editor);
      if (inited) {
        setInited(true);
      } else {
        setInited(false);
      }
    }, 100);

    return () => timer && clearInterval(timer);
  }, [editor]);

  useEffect(() => {
    BeacasCore.awaitInit().then(() => {
      setHasAuth(true);
    });
  }, []);

  const data: EditorContextProps = useMemo(() => {
    const adapterValues = { ...values, content: pageElement } as EmailTemplate;
    const dirty = !isEqual(initialValuesRef.current, adapterValues);
    return {
      initialValues: initialValuesRef.current,
      initialValuesRef,
      dirty,
      values: adapterValues,
      setValues,
      mergetagsData: mergetagsData,
      setMergetagsData,
      inited,
      pageDataVariables: pageElement.data.variables || [],
      submit() {
        props.onSubmit?.(adapterValues);
      },
    };
  }, [values, pageElement, mergetagsData, inited, props]);

  return useMemo(() => {
    if (!hasAuth) return <>{loading ? loading : null}</>;

    return (
      <>
        <EditorContext.Provider value={data}>
          {props.children}
        </EditorContext.Provider>
      </>
    );
  }, [data, hasAuth, loading, props.children]);
};
