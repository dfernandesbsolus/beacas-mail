import { Modal } from "@arco-design/web-react";
import { SharedComponents } from "@beacas-plugins/components";
import { store } from "@beacas-plugins/store";
import { BlockManager, ElementType, NodeUtils, t } from "beacas-core";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { Editor, Path, Transforms } from "slate";
import { useSlate } from "slate-react";

export const ColumnLayoutOverlay = observer(() => {
  const { visible } = store.ui.columnsOverlay;
  const [columns, setColumns] = useState<string[]>(["100%"]);
  const editor = useSlate();

  const onAddColumns = () => {
    const columnBlock = BlockManager.getBlockByType(
      ElementType.STANDARD_COLUMN
    );
    const textBlock = BlockManager.getBlockByType(
      ElementType.STANDARD_PARAGRAPH
    );

    const row = BlockManager.getBlockByType(
      ElementType.STANDARD_SECTION
    ).create({
      children: columns.map((width, index) => {
        return columnBlock.create({
          attributes: {
            width: width,
          },
          children: [
            textBlock.create({
              children: [{ text: "" }],
            }),
          ],
        });
      }),
    });

    const rowEleEntry = Editor.above(editor, {
      match: (n) => {
        return NodeUtils.isSectionElement(n);
      },
    });

    if (rowEleEntry) {
      const nextPath = Path.next(rowEleEntry[1]);
      Transforms.insertNodes(editor, row, {
        at: nextPath,
      });

      if (rowEleEntry[0].children.length === 1) {
        const textEleEntry = Editor.above(editor, {
          match: (n) => {
            if (NodeUtils.isBlockElement(n)) {
              return NodeUtils.isContentElement(n);
            }
            return false;
          },
        });

        if (textEleEntry) {
          Transforms.delete(editor, {
            at: textEleEntry[1],
          });
        }
      }

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
      hideCancel
      okText={t("Add Column Layout")}
      onCancel={() => store.ui.serColumnsOverlayVisible(false)}
      onOk={onAddColumns}
    >
      <div style={{ minHeight: 300 }}>
        <SharedComponents.ColumnLayout onSelectColumn={setColumns} />
      </div>
    </Modal>
  );
});
