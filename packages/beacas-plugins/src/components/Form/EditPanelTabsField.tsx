import { Empty, Message, Tabs, TabsProps } from "@arco-design/web-react";
import { cloneDeep, uniqueId } from "lodash";
import React, { ComponentProps, useMemo, useRef, useState } from "react";
import { enhancer } from "./enhancer";

export interface EditPanelTabsProps<T> extends Omit<TabsProps, "onChange"> {
  value: Array<T>;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderHeader: (item: T, index: number) => React.ReactNode;
  onChange: (vals: Array<T>) => any;
  additionItem?: T;
  atLastOne?: boolean;
}

function EditPanelTabs<T>(props: EditPanelTabsProps<T>) {
  const { value, additionItem, atLastOne = true } = props;
  const [activeKey, setActiveKey] = useState("0");
  const uuid = useRef(uniqueId());

  const onAdd = () => {
    const index = Number(activeKey);
    const newItem = additionItem || cloneDeep(value[index]);
    value.splice(index + 1, 0, newItem);
    props.onChange([...value]);
    setActiveKey(`${index + 1}`);
  };

  const onDelete = (index: string) => {
    if (value.length <= 1 && atLastOne) {
      Message.warning("At least one item is required");
      return;
    }
    props.onChange(value.filter((_, vIndex) => Number(index) !== vIndex));
    if (Number(index) === value.length - 1) {
      setActiveKey(`${Number(index) - 1}`);
    }
  };

  const list = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const content = (
    <Tabs
      activeTab={activeKey}
      onChange={(key) => setActiveKey(key)}
      editable
      onAddTab={onAdd}
      onDeleteTab={onDelete}
      style={{ maxWidth: 1180 }}
    >
      {list.map((item, index) => (
        <Tabs.TabPane
          key={index}
          title={
            <div
              id={`edit_panel_${uuid}_${index}`}
              style={{
                maxWidth: 120,
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {props.renderHeader(item, index)}
            </div>
          }
        >
          {props.renderItem(item, index)}
        </Tabs.TabPane>
      ))}
    </Tabs>
  );

  return <>{list.length === 0 ? <Empty /> : content}</>;
}

const DefaultEditPanelTabsField = enhancer(EditPanelTabs);

export const EditPanelTabsField = (
  props: Omit<ComponentProps<typeof DefaultEditPanelTabsField>, "">
) => {
  return (
    <>
      <DefaultEditPanelTabsField
        {...props}
        formItem={{
          style: { marginBottom: 0 },
          labelCol: {
            span: 0,
          },
          wrapperCol: {
            offset: 1,
            span: 21,
          },
          ...props.formItem,
        }}
      />
    </>
  );
};
