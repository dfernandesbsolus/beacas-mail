import { Collapse, Input, Message } from "@arco-design/web-react";
import { JsonAdapter } from "@beacas-plugins/components/Form/adapter";
import { useEditorForm } from "@beacas-plugins/hooks";
import { BeacasCore, t } from "beacas-core";
import {
  useEditorContext,
  useEditorProps,
  useSelectedNode,
} from "beacas-editor";
import React, { useCallback, useEffect } from "react";

export const SourceCodePanel = () => {
  const { selectedNodePath, selectedNode } = useSelectedNode();
  const { setFieldValue } = useEditorForm();
  const { values } = useEditorContext();
  const { universalElementSetting } = useEditorProps();

  const [text, setText] = React.useState<string>(
    JSON.stringify(selectedNode, null, 2)
  );

  const [mjml, setMjml] = React.useState<string>("");

  const onBlur = () => {
    if (!selectedNodePath) return;

    try {
      const newNode = JsonAdapter.normalize(text);
      setFieldValue(selectedNodePath, "", newNode);
    } catch (error) {
      console.log(error, text);

      Message.warning(t("Invalid JSON format"));
    }
  };

  const mjmlFormat = useCallback(() => {
    if (!selectedNode) return;

    try {
      const mjml = BeacasCore.toMJML({
        element: selectedNode,
        pageElement: values.content,
        mode: "production",
        universalElements: universalElementSetting,
      });
      setMjml(mjml);
    } catch (error) {
      console.log(error, selectedNode);
      Message.warning(t("Invalid JSON format"));
    }
  }, [selectedNode, universalElementSetting, values.content]);

  useEffect(() => {
    mjmlFormat();
  }, [mjmlFormat]);

  return (
    <Collapse defaultActiveKey={["json", "mjml"]}>
      <Collapse.Item name="json" header={"JSON data"}>
        <Input.TextArea
          value={text}
          rows={15}
          onChange={setText}
          onBlur={onBlur}
        />
      </Collapse.Item>
      <Collapse.Item name="mjml" header={"MJML format"}>
        <Input.TextArea value={mjml} rows={10} />
      </Collapse.Item>
    </Collapse>
  );
};
