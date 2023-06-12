import {
  Button,
  Card,
  Collapse,
  Empty,
  Message,
  Space,
  TabsProps,
} from "@arco-design/web-react";
import {
  IconCopy,
  IconDelete,
  IconDragArrow,
  IconPlus,
} from "@arco-design/web-react/icon";
import { cloneDeep, uniqueId } from "lodash";
import React, {
  ComponentProps,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { enhancer } from "./enhancer";
import { t } from "beacas-core";

export interface EditPanelListProps<T> extends Omit<TabsProps, "onChange"> {
  value: Array<T>;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderHeader: (item: T, index: number) => React.ReactNode;
  onChange: (vals: Array<T>) => any;
  additionItem?: T;
  header: string;
  headerKey: string;
  atLastOne?: boolean;
  onAddItem?: () => T;
  displayType?: "Collapse" | "Card";
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function EditPanelList<T>(props: EditPanelListProps<T>) {
  const {
    value,
    additionItem,
    atLastOne = true,
    displayType = "Collapse",
  } = props;
  const [activeKey, setActiveKey] = useState(["0"]);
  const uuid = useRef(uniqueId());

  const onAdd = (index: number) => {
    const newItem = additionItem || cloneDeep(value[index]);
    value.splice(index + 1, 0, newItem);
    props.onChange([...value]);
    setActiveKey([`${index + 1}`]);
  };

  const onAddOne = () => {
    const newItem = props.onAddItem!();
    const newList = [...value, newItem];
    props.onChange(newList);
    setActiveKey([newList.length - 1 + ""]);
  };

  const onDelete = (index: number) => {
    if (value.length <= 1 && atLastOne) {
      Message.warning("At least one item is required");
      return;
    }
    props.onChange(value.filter((_, vIndex) => Number(index) !== vIndex));
  };

  const list = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const onDragEnd = useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      if (!result.destination) {
        return;
      }

      const items = reorder(
        list,
        result.source.index,
        result.destination.index
      );

      props.onChange([...items]);
    },
    [list, props]
  );
  const content = (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Collapse
              activeKey={activeKey}
              onChange={(_, keys) => setActiveKey(keys)}
              accordion
              style={{ maxWidth: 1180 }}
            >
              {list.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={index.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div>
                      <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        style={provided.draggableProps.style}
                      >
                        <Collapse.Item
                          contentStyle={{ padding: 10 }}
                          key={index}
                          header={
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
                          name={index.toString()}
                          extra={
                            <Space>
                              <Button
                                icon={<IconCopy />}
                                onClick={() => onAdd(index)}
                                iconOnly
                              />
                              <Button
                                icon={<IconDelete />}
                                onClick={() => onDelete(index)}
                                iconOnly
                              />
                              <Button
                                style={{ cursor: "grab" }}
                                icon={<IconDragArrow />}
                              />
                            </Space>
                          }
                        >
                          {props.renderItem(item, index)}
                        </Collapse.Item>
                      </div>
                      {(provided as any).placeholder}
                    </div>
                  )}
                </Draggable>
              ))}
            </Collapse>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  if (displayType === "Card") {
    return (
      <Card
        title={
          <div
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {props.header}
          </div>
        }
        extra={
          props.onAddItem && (
            <Button
              size="small"
              onClick={onAddOne}
              icon={<IconPlus />}
            ></Button>
          )
        }
      >
        {list.length === 0 ? <Empty description={t("No data")} /> : content}
      </Card>
    );
  }
  return (
    <>
      <Collapse.Item
        name={props.headerKey}
        header={
          <div
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {props.header}
          </div>
        }
        extra={
          props.onAddItem && (
            <Button
              size="small"
              onClick={onAddOne}
              icon={<IconPlus />}
            ></Button>
          )
        }
        contentStyle={{ padding: 10 }}
      >
        {list.length === 0 ? <Empty description={t("No data")} /> : content}
      </Collapse.Item>
    </>
  );
}

const DefaultEditPanelListField = enhancer(EditPanelList);

export const EditPanelListField = (
  props: Omit<ComponentProps<typeof DefaultEditPanelListField>, "">
) => {
  return (
    <>
      <DefaultEditPanelListField
        {...props}
        formItem={{
          style: { marginBottom: 0 },
          labelCol: {
            span: 0,
          },
          wrapperCol: {
            span: 24,
          },
          ...props.formItem,
        }}
      />
      <Collapse.Item
        style={{ height: 0, overflow: "hidden" }}
        name={props.headerKey}
        header={
          <div
            style={{
              whiteSpace: "nowrap",
            }}
          >
            {props.header}
          </div>
        }
      ></Collapse.Item>
    </>
  );
};
