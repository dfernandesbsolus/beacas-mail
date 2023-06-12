import {
  Button,
  Form,
  Grid,
  Input,
  Popover,
  Space,
} from "@arco-design/web-react";
import { classnames } from "beacas-core";
import { TextFormat } from "beacas-editor";
import React, { useEffect, useRef, useState } from "react";
import { Transforms, Text } from "slate";
import { useSlate } from "slate-react";
import { getLinkNode } from "../utils/getLinkNode";

export const TextLink = () => {
  const editor = useSlate();
  const linkNodeEntry = getLinkNode(editor as any);
  const ref = useRef<HTMLElement | null>(null);
  const linkNode = linkNodeEntry?.[0];

  const [formState, setFormState] = useState<{ href?: string; text?: string }>({
    ...linkNode?.link,
    text: linkNode?.text || "",
  });

  useEffect(() => {
    setFormState({ ...linkNode?.link, text: linkNode?.text || "" });
  }, [linkNode?.link, linkNode?.text]);

  const onSubmit = (values: { href?: string; text?: string }) => {
    Transforms.setNodes(
      editor,
      {
        [TextFormat.LINK]: values.href
          ? {
              href: values.href,
              blank: true,
            }
          : null,
      },
      { match: Text.isText, split: true }
    );

    ref.current?.click();
  };

  const onRemove = () => {
    Transforms.setNodes(
      editor,
      {
        [TextFormat.LINK]: null,
      },
      { at: linkNodeEntry![1] }
    );

    ref.current?.click();
  };

  const onChange = (
    values: Partial<{
      href?: string;
      text?: string;
    }>
  ) => {
    setFormState(values);
  };

  const [from] = Form.useForm<{ href?: string; text?: string }>();

  return (
    <Popover
      trigger="click"
      triggerProps={{
        popupStyle: { padding: "10px 0px 0px 0px", width: 400 },
      }}
      getPopupContainer={(node) => {
        return Array.from(document.querySelectorAll(".RichTextBar")).find(
          (item) => item.contains(node)
        ) as HTMLElement;
      }}
      content={
        <div>
          <Form
            key={linkNodeEntry?.[1].join(",")}
            onSubmit={onSubmit}
            onChange={onChange}
            form={from}
            initialValues={formState}
          >
            <Form.Item
              label="URL"
              layout="vertical"
              field="href"
              style={{
                marginBottom: 10,
                paddingLeft: 15,
                paddingRight: 15,
                width: "calc(100% - 30px)",
              }}
            >
              <Input
                autoFocus
                placeholder="Paste link here"
                enterKeyHint="enter"
                allowClear
              />
            </Form.Item>
            {/* <Form.Item label="Link title" layout='vertical' field="text" style={{ marginBottom: 10, paddingLeft: 15, paddingRight: 15, width: 'calc(100% - 30px)' }}>
              <Input autoFocus placeholder='Paste link here' enterKeyHint='enter' allowClear />
            </Form.Item> */}
          </Form>

          <div
            style={{
              boxShadow: "rgb(55 53 47 / 9%) 0px -1px 0px",
              padding: 10,
            }}
          >
            <Grid.Row justify="end">
              <Space>
                {linkNode && (
                  <Button
                    style={{ width: "100%" }}
                    onClick={onRemove}
                    type="secondary"
                  >
                    Remove
                  </Button>
                )}
                <Button
                  style={{ width: "100%" }}
                  onClick={from.submit}
                  type="primary"
                >
                  Apply
                </Button>
              </Space>
            </Grid.Row>
          </div>
        </div>
      }
    >
      <span
        ref={ref}
        className={classnames(
          "HoveringToolbar-TextLink",
          formState.href && "format-active"
        )}
      >
        <span className={classnames(" iconfont icon-arrow_topright")} />
        <span className="HoveringToolbar-TextLink-content">Link</span>
      </span>
    </Popover>
  );
};
