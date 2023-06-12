import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  Form,
  Grid,
  Input,
  MenuProps,
  Message,
  Modal,
  Spin,
} from "@arco-design/web-react";
import imagePlaceholder from "@beacas-plugins/assets/images/image-placeholder.png";
import styles from "./index.module.scss";

import {
  useEditorContext,
  useEditorProps,
  useEventCallback,
} from "beacas-editor";
import { Uploader, UploaderServer } from "@beacas-plugins/utils/Uploader";
import { BeacasCore, NodeUtils, classnames, t } from "beacas-core";
import { isValidHttpUrl } from "@beacas-plugins/utils/isValidHttpUrl";
import { previewLoadImage } from "@beacas-plugins/utils/previewLoadImage";
import { enhancer } from "../enhancer";

export interface ImageUploaderProps {
  onChange: (val: string) => void;
  value: string;
  uploadHandler?: UploaderServer;
  autoCompleteOptions?: Array<{ value: string; label: React.ReactNode }>;
  hideMergeTag?: boolean;
  onCallbackImageDetail?: (size: { width: number; height: number }) => void;
  hideInput?: boolean;
  theme?: MenuProps["theme"];
}

function ImageUploader(props: ImageUploaderProps) {
  const { mergetagsData } = useEditorProps();
  const { pageDataVariables } = useEditorContext();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const uploadHandlerRef = useRef<UploaderServer | null | undefined>(
    props.uploadHandler
  );
  const [imgDetail, setImgDetail] = useState({
    width: 0,
    height: 0,
    size: 0,
  });

  const onCallbackImageDetail = useEventCallback(
    props.onCallbackImageDetail ||
      (() => {
        //
      })
  );

  const image = useMemo(() => {
    const isMatch = NodeUtils.isMergeTag(props.value);
    try {
      if (isMatch) {
        return (
          BeacasCore.renderWithData(props.value, {
            ...mergetagsData,
            ...pageDataVariables,
          }) || imagePlaceholder
        );
      }
    } catch (error: any) {
      console.error(error?.message || error);
    }
    return props.value;
  }, [mergetagsData, pageDataVariables, props.value]);

  useEffect(() => {
    if (props.value && isValidHttpUrl(props.value)) {
      Promise.all([
        fetch(props.value)
          .then((r) => r.arrayBuffer())
          .then((buffer) => +(buffer.byteLength / 1024).toFixed(2))
          .catch(() => 0),
        previewLoadImage(props.value),
      ])
        .then(([size, imgEle]) => {
          const detail = {
            width: imgEle.width,
            height: imgEle.height,
            size,
          };
          setImgDetail(detail);
        })
        .catch(() => {
          const detail = {
            width: 0,
            height: 0,
            size: 0,
          };
          setImgDetail(detail);
        });
    }
  }, [props.value]);

  const onChange = props.onChange;

  const onUpload = useCallback(() => {
    if (isUploading) {
      return Message.warning("Uploading...");
    }
    if (!uploadHandlerRef.current) return;

    const uploader = new Uploader(uploadHandlerRef.current, {
      limit: 1,
      accept: "image/*",
    });

    uploader.on("start", (photos) => {
      setIsUploading(true);

      uploader.on("end", async (data) => {
        const url = data[0]?.url;
        if (url) {
          if (isValidHttpUrl(url)) {
            const imgEle = await previewLoadImage(url);
            const detail = {
              width: imgEle.width,
              height: imgEle.height,
            };
            onCallbackImageDetail(detail);
          }
          onChange(url);
        }
        setIsUploading(false);
      });
    });

    uploader.chooseFile();
  }, [isUploading, onCallbackImageDetail, onChange]);

  const onPaste = useCallback(
    async (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!uploadHandlerRef.current) return;
      const clipboardData = e.clipboardData;

      for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i];
        if (item.kind == "file") {
          const blob = item.getAsFile();

          if (!blob || blob.size === 0) {
            return;
          }
          try {
            setIsUploading(true);
            const picture = await uploadHandlerRef.current(blob);
            const imgEle = await previewLoadImage(picture);
            const detail = {
              width: imgEle.width,
              height: imgEle.height,
            };
            onCallbackImageDetail(detail);
            props.onChange(picture);
            setIsUploading(false);
          } catch (error: any) {
            Message.error(error?.message || error || "Upload failed");
            setIsUploading(false);
          }
        }
      }
    },
    [onCallbackImageDetail, props]
  );

  const onRemove = useCallback(
    (ev: any) => {
      ev.stopPropagation();
      props.onChange("");
    },
    [props]
  );

  const content = useMemo(() => {
    if (isUploading) {
      return (
        <div className={styles["item"]}>
          <div className={classnames(styles["info"])}>
            <Spin size={60} />
            <div className={styles["btn-wrap"]} />
          </div>
        </div>
      );
    }

    if (!props.value) {
      return (
        <div>
          <div
            onClick={onUpload}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexDirection: "column",
              lineHeight: "22px",
            }}
          >
            <div style={{ fontSize: 16 }}>{t("Attach your image here.")}</div>
            <div style={{ color: "#606A72", fontSize: 14 }}>
              {t("Accepts .jpg, .jpeg, .png, and .gif file types.")}
            </div>
          </div>
        </div>
      );
    }

    return <img src={image} style={{ maxWidth: "100%" }} />;
  }, [image, isUploading, onUpload, props.value]);

  if (!props.uploadHandler) {
    return <Input value={props.value} onChange={onChange} />;
  }

  return (
    <>
      <Grid.Row>
        <Grid.Col span={image ? 12 : 24}>
          <div
            style={{
              padding: 15,
              border: "2px dashed rgb(153, 153, 153)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              minHeight: 100,
              boxSizing: "border-box",
            }}
          >
            {content}
          </div>
        </Grid.Col>

        {image && (
          <Grid.Col span={11} offset={1}>
            <div>
              {imgDetail.width} <span> x </span> {imgDetail.height}{" "}
            </div>
            <div style={{ marginTop: 10 }}>{imgDetail.size}k</div>
            <div style={{ marginTop: 10 }}>
              <span className={styles.actionItem} onClick={onUpload}>
                {t("Replace")}
              </span>
              <span> ∙ </span>
              <span
                className={styles.actionItem}
                onClick={() => setPreview(true)}
              >
                {t("Preview")}
              </span>
              {/* <span> ∙ </span>
              <span className={styles.actionItem} onClick={onRemove}>
                {t("Remove")}
              </span> */}
            </div>
          </Grid.Col>
        )}
        <Form.Item style={{ marginTop: 16 }} label={t("URL")}>
          <Input
            value={props.value}
            onChange={onChange}
            onPaste={onPaste}
            disabled={isUploading}
          />
        </Form.Item>
        <Modal
          visible={preview}
          footer={null}
          onCancel={() => setPreview(false)}
        >
          <img alt="Preview" style={{ width: "100%" }} src={image} />
        </Modal>
      </Grid.Row>
    </>
  );
}

export const ImageUploaderField = enhancer(ImageUploader);
