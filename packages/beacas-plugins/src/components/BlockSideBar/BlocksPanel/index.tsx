import { Button, Space } from "@arco-design/web-react";
import { t } from "beacas-core";
import { useEditorProps, useEditorState } from "beacas-editor";
import React, { useState } from "react";
import { BlockList } from "../BlockList";

export const BlocksPanel = () => {
  const [tab, setTab] = useState<"Default" | "Universal">("Default");

  const { universalElementEditing } = useEditorState();

  const { universalElementSetting } = useEditorProps();

  return (
    <>
      {!universalElementEditing && universalElementSetting && (
        <div style={{ padding: 24 }}>
          <Button.Group style={{ width: "100%" }}>
            <Button
              type={tab === "Default" ? "outline" : undefined}
              style={{ width: "50%" }}
              onClick={() => setTab("Default")}
            >
              <Space>{t("Default")}</Space>
            </Button>
            <Button
              type={tab === "Universal" ? "outline" : undefined}
              style={{ width: "50%" }}
              onClick={() => setTab("Universal")}
            >
              <Space>{t("Universal")}</Space>
            </Button>
          </Button.Group>
        </div>
      )}
      <BlockList tab={tab} />
    </>
  );
};
