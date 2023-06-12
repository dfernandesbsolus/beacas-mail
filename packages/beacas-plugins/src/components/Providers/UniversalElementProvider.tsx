import { Form, Input, Modal } from "@arco-design/web-react";
import { BlockManager, Element, t } from "beacas-core";
import { EmailEditorProps, useEditorProps } from "beacas-editor";
import React, { useCallback, useMemo, useState } from "react";
import { ReactEditor, useSlate } from "slate-react";

export interface UniversalElementProps {
  open: (element: Element) => void;
  setElement: React.Dispatch<React.SetStateAction<Element | undefined>>;
}

export const UniversalElementProviderContext =
  React.createContext<UniversalElementProps>({} as any);

export const UniversalElementProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { universalElementSetting } = useEditorProps();
  const [visible, setVisible] = useState(false);

  const [element, setElement] = useState<Element>();

  const open = useCallback((element: Element) => {
    setElement(element);
    setVisible(true);
  }, []);

  const onSubmit: NonNullable<
    EmailEditorProps["universalElementSetting"]
  >["onAddElement"] = useCallback(
    async (params) => {
      return universalElementSetting!.onAddElement(params);
    },
    [universalElementSetting]
  );

  const close = useCallback(() => {
    setVisible(false);
    setElement(undefined);
  }, []);

  const value = useMemo(() => {
    return {
      open,
      close,
      setElement,
    };
  }, [close, open]);

  return useMemo(() => {
    return (
      <UniversalElementProviderContext.Provider value={value}>
        {children}
        {element && (
          <UniversalContent
            visible={visible}
            close={close}
            onSubmit={onSubmit}
            element={element}
          />
        )}
      </UniversalElementProviderContext.Provider>
    );
  }, [children, close, element, onSubmit, value, visible]);
};

const UniversalContent = (props: {
  visible: boolean;
  close: () => void;
  element: Element;
  onSubmit: NonNullable<
    EmailEditorProps["universalElementSetting"]
  >["onAddElement"];
}) => {
  const editor = useSlate();
  const [value, setValue] = useState(BlockManager.getBlockTitle(props.element));
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    if (value.length < 2) {
      throw new Error(t("Name must be at least 2 characters long"));
    }
    setLoading(true);

    const html2canvas = (await import("html2canvas")).default;

    const container = ReactEditor.toDOMNode(editor, props.element);
    let blob = await new Promise<Blob | null>((resolve) => {
      html2canvas(container, { useCORS: true }).then((canvas) => {
        return canvas.toBlob(resolve, "png", 0.1);
        // window
        //   .open()
        //   .document.write('<img src="' + canvas.toDataURL() + '" />');
      });
    });

    if (!blob) {
      blob = new Blob([], { type: "image/png" });
    }

    const universalElement = await props.onSubmit({
      name: value,
      element: {
        title: value,
        ...props.element,
      },
      thumbnail: blob,
    });
    editor.replaceNode({
      path: ReactEditor.findPath(editor, props.element),
      node: universalElement,
    });
    props.close();
    setLoading(false);
  }, [editor, props, value]);

  return (
    <Modal
      okButtonProps={{
        loading: loading,
      }}
      onCancel={props.close}
      onOk={onSubmit}
      visible={props.visible}
      title={
        <div style={{ textAlign: "left" }}>{t("Create Universal Element")}</div>
      }
    >
      <Form style={{ width: "100%" }}>
        <Form.Item layout="inline">
          {t(
            `When you make changes to universal element, those changes will be applied to all templates that contain that content.`
          )}
        </Form.Item>
        <Form.Item layout="vertical" label={t("Element name")}>
          <Input
            size="large"
            min={2}
            max={32}
            value={value}
            onChange={setValue}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
