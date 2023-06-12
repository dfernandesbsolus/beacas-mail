import {
  Button,
  Drawer,
  Message,
  PageHeader,
  Popconfirm,
  Space,
  Typography,
} from "@arco-design/web-react";
import { IconLeft } from "@arco-design/web-react/icon";
import { useEditorForm } from "@beacas-plugins/hooks";
import { BlockManager, Element, t } from "beacas-core";
import { useEditorProps, useEditorState } from "beacas-editor";
import { cloneDeep, isEqual } from "lodash";
import React, { useMemo } from "react";
import { Node } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import "./index.scss";

export const UniversalElementEditorDrawer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = React.useState(false);

  const editor = useSlate();

  const {
    universalElementEditing,
    setUniversalElementPath,
    universalElementPath,
    initialUniversalElement,
  } = useEditorState();

  const universalElement =
    universalElementPath && (Node.get(editor, universalElementPath) as Element);

  const hasChanged = useMemo(() => {
    if (!universalElementPath || !initialUniversalElement) return false;

    return !isEqual(universalElement, initialUniversalElement);
  }, [initialUniversalElement, universalElement, universalElementPath]);

  const { universalElementSetting } = useEditorProps();

  const { setFieldValue } = useEditorForm();

  const onChangeTitle = (value: string) => {
    if (!universalElementPath) return;
    setFieldValue(universalElementPath, "title", value);
  };

  const onCancelUniversalElementEditing = () => {
    if (!hasChanged) {
      setUniversalElementPath(null);
      return;
    }

    editor.replaceNode({
      path: universalElementPath!,
      node: initialUniversalElement!,
    });
    setTimeout(() => {
      setUniversalElementPath(null);
    }, 0);
  };

  const onPublishElement = async () => {
    if (!hasChanged) {
      setUniversalElementPath(null);
      return;
    }
    if (!universalElement?.title || universalElement?.title?.length < 2) {
      throw new Error(t("Name must be at least 2 characters long"));
    }
    if (!universalElementSetting || !universalElement) return;
    setLoading(true);

    setLoading(true);

    const html2canvas = (await import("html2canvas")).default;

    const container = ReactEditor.toDOMNode(editor, universalElement);
    let blob = await new Promise<Blob | null>((resolve) => {
      html2canvas(container, { useCORS: true }).then((canvas) => {
        return canvas.toBlob(resolve, "png", 0.1);
      });
    });

    if (!blob) {
      blob = new Blob([], { type: "image/png" });
    }

    try {
      await universalElementSetting.onUpdateElement({
        uid: universalElement.uid!,
        element: cloneDeep(universalElement),
        thumbnail: blob,
      });

      setUniversalElementPath(null);
    } catch (error) {
      Message.error(String(error));
    }
    setLoading(false);
  };

  const visible = universalElementEditing;

  return (
    <>
      {!visible && children}
      <Drawer
        className="UniversalElementEditorDrawer"
        width="100%"
        title={null}
        closable={false}
        focusLock={false}
        placement="left"
        bodyStyle={{ padding: 0, transition: "none" }}
        visible={visible}
        footer={null}
      >
        <PageHeader
          backIcon={
            hasChanged ? (
              <Popconfirm
                focusLock
                title={t("Do you want to discard?")}
                okText={t("Discard")}
                cancelText={t("Cancel")}
                okButtonProps={{
                  status: "danger",
                }}
                onOk={() => {
                  onCancelUniversalElementEditing();
                }}
              >
                <IconLeft style={{ fontSize: 24 }} />
              </Popconfirm>
            ) : (
              <IconLeft style={{ fontSize: 24 }} />
            )
          }
          className="UniversalElementEditorDrawer-header"
          title={
            <div
              style={{
                height: 40,
                position: "absolute",
                width: 300,
                top: 18,
                display: "flex",
              }}
            >
              <Typography.Title
                heading={5}
                style={{
                  margin: 0,
                }}
                editable={{
                  onChange: onChangeTitle,
                }}
              >
                {universalElement &&
                  BlockManager.getBlockTitle(universalElement)}
              </Typography.Title>
            </div>
          }
          extra={
            <div>
              <Space>
                {hasChanged ? (
                  <Popconfirm
                    title={t("Do you want to discard?")}
                    okText={t("Discard")}
                    cancelText={t("Cancel")}
                    okButtonProps={{
                      status: "danger",
                    }}
                    onOk={() => {
                      onCancelUniversalElementEditing();
                    }}
                  >
                    <Button disabled={loading}>{t(`Cancel`)}</Button>
                  </Popconfirm>
                ) : (
                  <Button disabled={loading}>{t(`Cancel`)}</Button>
                )}
                <Button
                  loading={loading}
                  onClick={onPublishElement}
                  type="primary"
                >
                  {t(`Publish`)}
                </Button>
              </Space>
            </div>
          }
        ></PageHeader>
        {visible && children}
      </Drawer>
    </>
  );
};
