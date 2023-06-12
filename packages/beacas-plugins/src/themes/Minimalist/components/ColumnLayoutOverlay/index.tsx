import { Modal } from "@arco-design/web-react";
import { SharedComponents } from "@beacas-plugins/components";
import { store } from "@beacas-plugins/store";
import {
  BlockManager,
  ElementCategory,
  ElementType,
  NodeUtils,
  t,
} from "beacas-core";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Editor, Path, Transforms } from "slate";
import { useSlate } from "slate-react";

export const ColumnLayoutOverlay = observer(() => {
  const { visible } = store.ui.columnsOverlay;
  const [columns, setColumns] = useState<string[]>(["100%"]);
  const editor = useSlate();

  const onAddColumns = () => {
    const columnBlock = BlockManager.getBlockByType("standard-column");

    const row = BlockManager.getBlockByType(
      ElementType.STANDARD_SECTION
    ).create({
      children: columns.map((width, index) => {
        return columnBlock.create({
          attributes: {
            width: width,
          },
          children: [],
        });
      }),
    });

    const rowEleEntry = Editor.above(editor, {
      match: (n) => {
        if (NodeUtils.isBlockElement(n)) {
          const block = BlockManager.getBlockByType(n.type);

          return block.category.includes(ElementCategory.SECTION);
        }
        return false;
      },
    });

    if (rowEleEntry) {
      Transforms.insertNodes(editor, row, {
        at: Path.next(rowEleEntry[1]),
      });

      store.ui.serColumnsOverlayVisible(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: 18, padding: 10, textAlign: "left" }}>
          {t("Configure Column Layout")}
        </div>
      }
      visible={visible}
      alignCenter={false}
      closable={false}
      hideCancel
      okText={t("Add Column Layout")}
      onOk={onAddColumns}
    >
      <div style={{ minHeight: 300 }}>
        <SharedComponents.ColumnLayout onSelectColumn={setColumns} />
      </div>
    </Modal>
  );
});
