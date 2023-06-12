import { useEditorForm } from "@beacas-plugins/hooks/useEditorForm";
import { Element, NodeUtils } from "beacas-core";
import { ActiveTabKeys } from "beacas-editor";
import { get } from "lodash";
import React from "react";
import { useEffect } from "react";
import { Editor, Node, Path, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { useSlate } from "slate-react";

export interface SyncChildrenFieldProps {
  name: string;
  childrenFieldName: string;
  onChange?: (val: any) => void;
  path: Path;
  mode: ActiveTabKeys;
}
export const SyncChildrenField = (props: SyncChildrenFieldProps) => {
  return <SlateField {...props} path={props.path} />;
};

const SlateField = (props: SyncChildrenFieldProps & { path: Path }) => {
  const { getFieldValue } = useEditorForm();
  const editor = useSlate();

  const attributesKey =
    props.mode === ActiveTabKeys.DESKTOP ? "attributes" : "mobileAttributes";

  const currentValue = getFieldValue(
    props.path,
    attributesKey + "." + props.name
  );

  useEffect(() => {
    HistoryEditor.withoutSaving(editor, () => {
      Editor.withoutNormalizing(editor, () => {
        const currentNode = Node.get(editor, props.path) as Element | undefined;
        currentNode?.children.forEach((child, index) => {
          if (!NodeUtils.isElement(child)) return;

          if (
            get(child, attributesKey + "." + props.childrenFieldName) ===
            currentValue
          )
            return;

          const attrs = {
            ...child.attributes,
            [props.childrenFieldName]: currentValue,
          };

          Transforms.setNodes(
            editor,
            {
              [attributesKey]: {
                ...attrs,
              },
            },
            {
              at: [...props.path, index],
            }
          );
        });
      });
    });
  }, [
    currentValue,
    props.childrenFieldName,
    attributesKey,
    editor,
    props.path,
  ]);

  return null;
};
