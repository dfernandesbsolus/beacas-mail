import React, { useMemo } from "react";
import { TabHeader } from "./components/TabHeader";
// import { AffixTools } from "./components/AffixTools";
import { Space, Button, Tooltip } from "@arco-design/web-react";
import { IconDelete, IconEye } from "@arco-design/web-react/icon";
import { t } from "beacas-core";
import { useEditorProps, useEditorState } from "beacas-editor";
import { useElementInteract } from "@beacas-plugins/hooks";
import { isUndefined } from "lodash";
import { SharedComponents } from "..";

export const EditorTabs: React.FC<{ children: React.ReactNode }> = (props) => {
  const { clearCanvas } = useElementInteract();
  const { readOnly, showPreview } = useEditorProps();
  const { universalElementEditing } = useEditorState();

  const onPointerDown: React.DOMAttributes<HTMLDivElement>["onPointerDown"] = (
    ev
  ) => {
    ev.preventDefault();
    clearCanvas();
  };

  const canPreview = useMemo(() => {
    if (!isUndefined(showPreview)) {
      return showPreview;
    }
    if (readOnly) {
      return false;
    }
    return true;
  }, [readOnly, showPreview]);

  return (
    <>
      <TabHeader
        right={
          <Space>
            {!universalElementEditing && !readOnly && (
              <Tooltip content={t("clear the entire canvas")}>
                <Button onPointerDown={onPointerDown}>
                  <IconDelete />
                </Button>
              </Tooltip>
            )}

            {canPreview && (
              <SharedComponents.PreviewEmailDrawer>
                <Tooltip content={t("Email preview")}>
                  <Button>
                    <IconEye />
                  </Button>
                </Tooltip>
              </SharedComponents.PreviewEmailDrawer>
            )}
            <div />
          </Space>
        }
        left={null}
      />

      <div style={{ height: "calc(100% - 60px)", overflow: "hidden" }}>
        {props.children}
      </div>
      {/* <AffixTools /> */}
    </>
  );
};
