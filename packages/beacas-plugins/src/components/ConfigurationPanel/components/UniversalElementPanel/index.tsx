import { Button, Card, Form, Space } from "@arco-design/web-react";
import { IconEdit } from "@arco-design/web-react/icon";
import { IconFont } from "@beacas-plugins/components/IconFont";
import { useEditorForm } from "@beacas-plugins/hooks";
import { t } from "beacas-core";
import { useEditorState, useSelectedNode } from "beacas-editor";
import React from "react";
import { useSlate } from "slate-react";

export const UniversalElementPanel = () => {
  const editor = useSlate();
  const { selectedNodePath } = useSelectedNode();
  const { setFieldValue } = useEditorForm();
  const { setUniversalElementPath } = useEditorState();

  const onResetToEditableElement = () => {
    if (!selectedNodePath) return;
    setFieldValue(selectedNodePath, "uid", undefined);
  };

  return (
    <Card style={{ margin: "20px" }}>
      <div>
        {t(
          `Edit universal content to update all instances across your emails and templates, or unlink this instance to edit it independently.`
        )}
      </div>
      <Form.Item></Form.Item>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="primary"
          icon={<IconEdit />}
          style={{ width: "100%" }}
          onClick={() => setUniversalElementPath(selectedNodePath)}
        >
          {t(`Edit Across All Instances`)}
        </Button>
        <Button
          onClick={onResetToEditableElement}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          icon={
            <IconFont
              iconName="icon-unlink"
              style={{ marginRight: 4, fontSize: 12 }}
            />
          }
        >
          {t(`Unlink and Edit Independently`)}
        </Button>
      </Space>
    </Card>
  );
};
