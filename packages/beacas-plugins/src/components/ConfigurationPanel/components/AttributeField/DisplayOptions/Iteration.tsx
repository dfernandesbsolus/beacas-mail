import { Collapse, Grid, Switch } from "@arco-design/web-react";
import { NumberField, TextField } from "@beacas-plugins/components/Form";
import { Element, t } from "beacas-core";
import { CustomSlateEditor } from "beacas-editor";

import React, { useCallback } from "react";
import { Path, Transforms } from "slate";

export function Iteration({
  selectedBlock,
  nodePath,
  editor,
}: {
  selectedBlock: Element;
  nodePath: Path;
  editor: CustomSlateEditor;
}) {
  const iteration = selectedBlock.logic?.iteration;

  const onIterationToggle = useCallback(
    (enabled: boolean) => {
      Transforms.setNodes(
        editor,
        {
          logic: {
            ...selectedBlock.logic,
            iteration: selectedBlock.logic?.iteration
              ? {
                  ...selectedBlock.logic.iteration,
                  enabled,
                }
              : {
                  enabled: true,
                  dataSource: "",
                  itemName: "item",
                  limit: 9999,
                  mockQuantity: 1,
                },
          },
        },
        {
          at: nodePath,
        }
      );
    },
    [editor, nodePath, selectedBlock.logic]
  );

  return (
    <Collapse activeKey={["Iteration"]}>
      <Collapse.Item
        className="iteration"
        destroyOnHide
        contentStyle={{ padding: "8px 13px 8px 13px" }}
        name="Iteration"
        header={t("CONTENT REPEAT")}
        extra={
          <div style={{ marginRight: 10 }}>
            <Switch checked={iteration?.enabled} onChange={onIterationToggle} />
          </div>
        }
      >
        <p>
          {t(
            `To repeat this content, specify a variable to “loop over” (i.e., repeat) as well as an alias you can use in your template.`
          )}
        </p>
        {iteration?.enabled && (
          <Grid.Col span={24}>
            <div>
              <TextField
                label={t("Repeat for")}
                name={`logic.iteration.dataSource`}
                path={nodePath}
              />
              <Grid.Row>
                <Grid.Col span={24}>
                  <TextField
                    label={t("Item alias")}
                    name={`logic.iteration.itemName`}
                    path={nodePath}
                  />
                  <NumberField
                    label={t("Quantity")}
                    name={`logic.iteration.limit`}
                    path={nodePath}
                  />
                </Grid.Col>
              </Grid.Row>
            </div>
          </Grid.Col>
        )}
      </Collapse.Item>
    </Collapse>
  );
}
