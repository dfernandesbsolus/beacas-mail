import { BeacasCore, NodeUtils } from "beacas-core";
import {
  EditorContextProps,
  useEditorContext,
  useEditorProps,
  useEventCallback,
} from "beacas-editor";
import { cloneDeep, get, isEqual, omit, set } from "lodash";
import { useCallback } from "react";
import { Path, Node, Transforms } from "slate";
import { useSlate } from "slate-react";
import { Form } from "@arco-design/web-react";

export const getNodePathName = (path: Path, name: string) => {
  if (!name) return path.join(".children.");
  return path.join(".children.") + "." + name;
};

export const useEditorForm = () => {
  const editor = useSlate();
  const { setValues, initialValuesRef, values } = useEditorContext();
  const { form } = Form.useFormContext();
  const { universalElementSetting } = useEditorProps();

  const getFieldValue = useEventCallback((path: Path, name: string) => {
    try {
      const node = Node.get(editor, path);
      if (name === "") return node;
      return get(node, name);
    } catch (error) {
      return undefined;
    }
  });

  const getFieldDirty = useCallback(
    (path: Path, name: string) => {
      const field = getNodePathName(path, name);

      return !isEqual(
        get(initialValuesRef.current.content, field),
        getFieldValue(path, name)
      );
    },
    [getFieldValue, initialValuesRef]
  );

  const setFieldValue = useEventCallback(
    (path: Path, name: string, val: any) => {
      try {
        const node = Node.get(editor, path);

        if (NodeUtils.isTextNode(node)) {
          Transforms.insertText(editor, val, {
            at: path,
          });
        } else {
          if (name === "children") {
            const cloneNode = cloneDeep(node);
            set(cloneNode, name, val);
            editor.replaceNode({
              path,
              node: cloneNode,
            });
          } else if (name === "") {
            editor.replaceNode({
              path,
              node: val,
            });
          } else {
            const cloneNode = cloneDeep(omit(node, "children")) as any;
            if (val === undefined) {
              const dotIndex = name.lastIndexOf(".");
              if (dotIndex > -1) {
                const parentName = name.substring(0, dotIndex);
                const parent = get(cloneNode, parentName);
                if (parent) {
                  delete parent[name.substring(dotIndex + 1)];
                }
              } else {
                delete cloneNode[name];
              }
            } else {
              set(cloneNode, name, val);
            }
            Transforms.setNodes(editor, cloneNode, {
              at: path,
            });
          }
        }

        form.setFieldValue(getNodePathName(path, name), val);
      } catch (error) {
        console.log(error);
      }
    }
  );

  const reset = useCallback(
    (newValues: EditorContextProps["values"]) => {
      if (isEqual(newValues, values)) return;
      try {
        let pageBlock = newValues.content;

        if (universalElementSetting) {
          pageBlock = BeacasCore.transformUniversalElements({
            content: pageBlock,
            universalElements: universalElementSetting.elements,
          });
        }

        Transforms.setNodes(editor, pageBlock, {
          at: [0],
        });

        setValues(newValues);
        initialValuesRef.current = newValues;
      } catch (error) {
        console.error(error);
      }
    },
    [editor, initialValuesRef, setValues, universalElementSetting, values]
  );

  return {
    getFieldValue,
    setFieldValue,
    getFieldDirty,
    reset,
    values,
  };
};
