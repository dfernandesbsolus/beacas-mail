import {
  Collapse,
  Grid,
  Switch,
  Button,
  List,
  Modal,
  Form,
  Divider,
  Tooltip,
  Link,
  Input,
  Select,
  Message,
} from "@arco-design/web-react";

import React, { useCallback, useMemo, useState } from "react";
import { upperFirst } from "lodash";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import {
  ConditionOperator,
  ConditionOperatorSymbol,
  Element,
  LogicCondition,
  LogicConditionGroup,
  LogicConditionGroupItem,
  t,
} from "beacas-core";
import { Path } from "slate";
import { CustomSlateEditor, useForceUpdate } from "beacas-editor";
import { useEditorForm } from "@beacas-plugins/hooks";
import { generateLogic } from "@beacas-plugins/utils/generateLogic";

export function Condition(props: {
  selectedBlock: Element;
  nodePath: Path;
  editor: CustomSlateEditor;
}) {
  const [conditionModalVisible, setConditionModalVisible] = useState(false);
  const { selectedBlock, nodePath } = props;
  const { setFieldValue } = useEditorForm();
  const condition = selectedBlock.logic?.condition;

  const onConditionToggle = useCallback(
    (enabled: boolean) => {
      if (enabled) {
        setConditionModalVisible(true);
      } else {
        setFieldValue(nodePath, "logic", {
          ...selectedBlock.logic,
          condition: {
            ...selectedBlock.logic!.condition,
            enabled,
          },
        });
      }
    },
    [nodePath, selectedBlock.logic, setFieldValue]
  );

  const onEdit = () => {
    setConditionModalVisible(true);
  };

  const onSubmit = (values: { condition: LogicCondition }) => {
    setFieldValue(nodePath, "logic", {
      ...selectedBlock.logic,
      condition: values.condition,
    });
    setConditionModalVisible(false);
  };

  const initialValues = useMemo(() => {
    if (condition) return { condition };
    return {
      condition: {
        enabled: true,
        symbol: ConditionOperatorSymbol.AND,
        groups: [
          {
            symbol: ConditionOperatorSymbol.AND,
            groups: [
              {
                left: "",
                operator: ConditionOperator.EQUAL,
                right: "",
              },
            ],
          },
        ],
      },
    };
  }, [condition]);

  return (
    <Collapse activeKey={["Condition"]}>
      <Collapse.Item
        contentStyle={{ padding: "8px 13px 8px 13px" }}
        className="condition"
        destroyOnHide
        name="Condition"
        header={t("SHOW/HIDE LOGIC")}
        extra={
          <div style={{ marginRight: 10 }}>
            <Switch checked={condition?.enabled} onChange={onConditionToggle} />
          </div>
        }
      >
        <p>
          {t(
            `Specify conditional logic to determine if a recipient will see the block.`
          )}{" "}
          <Link onClick={onEdit}>{t(`Edit`)}</Link>
        </p>
        {condition?.enabled && (
          <Form.Item label={t("Logic")} colon>
            <span>{generateLogic(condition)}</span>
          </Form.Item>
        )}
      </Collapse.Item>

      <Form initialValues={initialValues} onSubmit={onSubmit}>
        <ConditionModal
          {...props}
          visible={conditionModalVisible}
          onClose={() => setConditionModalVisible(false)}
        />
      </Form>
    </Collapse>
  );
}
const ConditionModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { form } = Form.useFormContext();
  const { forceUpdate } = useForceUpdate();

  const condition = form.getFieldValue("condition") as LogicCondition;

  const onAddCondition = useCallback(
    (path: string) => {
      const groups = form.getFieldValue(path) as LogicConditionGroup[];
      groups.push({
        symbol: ConditionOperatorSymbol.AND,
        groups: [
          {
            left: "",
            operator: ConditionOperator.EQUAL,
            right: "",
          },
        ],
      });
      form.setFieldValue(path, [...groups]);
      forceUpdate();
    },
    [forceUpdate, form]
  );

  const onAddSubCondition = useCallback(
    (path: string) => {
      const groups = form.getFieldValue(path) as LogicConditionGroup["groups"];
      groups.push({
        left: "",
        operator: ConditionOperator.EQUAL,
        right: "",
      });

      form.setFieldValue(path, [...groups]);
      forceUpdate();
    },
    [forceUpdate, form]
  );

  const onDelete = useCallback(
    (path: string, gIndex: number, ggIndex: number) => {
      if (!condition) return;

      const subPath = `${path}.${gIndex}.groups`;
      const groups = form.getFieldValue(path) as any[];
      const subGroups = form.getFieldValue(subPath) as any[];
      subGroups.splice(ggIndex, 1);
      if (subGroups.length === 0) {
        if (groups.length === 1) {
          Message.warning("At least one condition");
          return;
        }
        // remove empty array
        groups.splice(gIndex, 1);
        form.setFieldValue(path, [...groups]);
      } else {
        form.setFieldValue(subPath, [...subGroups]);
      }
      forceUpdate();
    },
    [condition, forceUpdate, form]
  );

  return (
    <Modal
      visible={visible}
      title={<div style={{ textAlign: "left" }}>{t("Logic")}</div>}
      okText={t("Save")}
      cancelText={t("Cancel")}
      onOk={form.submit}
      onCancel={onClose}
    >
      <List
        header={
          <Grid.Row justify="space-between">
            <Grid.Col span={16}>
              {condition.groups.length > 1 && (
                <Form.Item
                  layout="inline"
                  field={`condition.symbol`}
                  label={t("Outer connector")}
                >
                  <Select
                    options={[
                      {
                        label: "And",
                        value: ConditionOperatorSymbol.AND,
                      },
                      {
                        label: "Or",
                        value: ConditionOperatorSymbol.OR,
                      },
                    ]}
                  />
                </Form.Item>
              )}
            </Grid.Col>
            <Button
              onClick={() => onAddCondition(`condition.groups`)}
              size="small"
              icon={<IconPlus />}
            />
          </Grid.Row>
        }
        dataSource={condition.groups}
        render={(group, gIndex) => {
          return (
            <List.Item key={gIndex}>
              <div>
                <Grid.Row justify="space-between">
                  <Grid.Col span={16}>
                    <Form.Item
                      label={t("Connector")}
                      layout="inline"
                      labelCol={{
                        style: {
                          textAlign: "left",
                        },
                      }}
                      field={`condition.groups.${gIndex}.symbol`}
                    >
                      <Select
                        options={[
                          {
                            label: "And",
                            value: ConditionOperatorSymbol.AND,
                          },
                          {
                            label: "Or",
                            value: ConditionOperatorSymbol.OR,
                          },
                        ]}
                      />
                    </Form.Item>
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <Form.Item wrapperCol={{ style: { textAlign: "right" } }}>
                      <Tooltip content={t("Add logic")}>
                        <Button
                          size="small"
                          icon={<IconPlus />}
                          onClick={() =>
                            onAddSubCondition(
                              `condition.groups.${gIndex}.groups`
                            )
                          }
                        />
                      </Tooltip>
                    </Form.Item>
                  </Grid.Col>
                </Grid.Row>
                <Divider style={{ margin: "0px 0 20px 0" }} />
                {group.groups.map((item, ggIndex) => (
                  <ConditionItem
                    onDelete={onDelete}
                    path={`condition.groups`}
                    gIndex={gIndex}
                    ggIndex={ggIndex}
                    key={ggIndex}
                  />
                ))}
              </div>
            </List.Item>
          );
        }}
      />
      <Form.Item field={"condition.enabled"} noStyle>
        <Input hidden />
      </Form.Item>
    </Modal>
  );
};

const options: Array<{
  tootip: string;
  value: ConditionOperator;
  label: string;
}> = [
  {
    tootip: "Truthy",
    label: "Truthy",
    value: ConditionOperator.TRUTHY,
  },
  {
    tootip: "Falsy",
    label: "Falsy",
    value: ConditionOperator.FALSY,
  },
  {
    tootip: "Equal",
    label: "==",
    value: ConditionOperator.EQUAL,
  },
  {
    tootip: "Not equal",
    label: "!=",
    value: ConditionOperator.NOT_EQUAL,
  },
  {
    tootip: "Greater than",
    label: ">",
    value: ConditionOperator.GREATER,
  },
  {
    tootip: "Greater than or equal",
    label: ">=",
    value: ConditionOperator.GREATER_OR_EQUAL,
  },
  {
    tootip: "Less than",
    label: "<",
    value: ConditionOperator.LESS,
  },
  {
    tootip: "Less than or equal",
    label: "<=",
    value: ConditionOperator.LESS_OR_EQUAL,
  },
];

Object.values(ConditionOperator).map((item) => ({
  label: upperFirst(item),
  value: item,
}));

function ConditionItem({
  path,
  onDelete,
  gIndex,
  ggIndex,
}: {
  path: string;
  gIndex: number;
  ggIndex: number;
  onDelete: (path: string, gIndex: number, ggIndex: number) => void;
}) {
  const name = `${path}.${gIndex}.groups.${ggIndex}`;

  const value = Form.useWatch(name) as LogicConditionGroupItem;

  const hideRight =
    value.operator === ConditionOperator.TRUTHY ||
    value.operator === ConditionOperator.FALSY;

  return (
    <>
      <Grid.Row align="end">
        <Grid.Col span={8}>
          <Form.Item
            label={t("Variable")}
            field={`${name}.left`}
            layout="vertical"
          >
            <Input placeholder={"customer.country"} />
          </Form.Item>
        </Grid.Col>
        <Grid.Col span={5} style={{ paddingLeft: 10 }}>
          <Form.Item
            label={t("Operator")}
            field={`${name}.operator`}
            layout="vertical"
          >
            <Select options={options}>
              {options.map((item) => {
                return (
                  <Select.Option key={item.value} value={item.value}>
                    <Tooltip content={item.tootip}>
                      <div>{item.label}</div>
                    </Tooltip>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Grid.Col>
        <Grid.Col span={8} style={{ paddingLeft: 10 }}>
          {!hideRight && (
            <Form.Item
              label={t("Value")}
              field={`${name}.right`}
              layout="vertical"
            >
              <Input placeholder={"Canda"} />
            </Form.Item>
          )}
        </Grid.Col>
        <Grid.Col span={3}>
          <Form.Item
            wrapperCol={{
              style: {
                textAlign: "right",
              },
            }}
            layout="vertical"
          >
            <Button
              onClick={() => onDelete(path, gIndex, ggIndex)}
              icon={<IconDelete />}
            />
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
    </>
  );
}
