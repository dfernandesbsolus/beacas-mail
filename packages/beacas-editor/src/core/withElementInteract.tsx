import React, { useEffect, useMemo } from "react";
import { ReactEditor, useSlate } from "slate-react";
import { ElementProps } from "@beacas-editor/components/Elements";
import { useEditorProps } from "@beacas-editor/hooks/useEditorProps";
import { useEditorState } from "@beacas-editor/hooks/useEditorState";
import { useEditorContext } from "..";
import { Path } from "slate";

export const withElementInteract = (Com: any) => {
  return (props: ElementProps) => {
    const editor = useSlate();

    const [nodeElement, setNodeElement] = React.useState<HTMLElement | null>(
      null
    );

    const {
      selectedNodePath,
      hoverNodePath,
      dragNodePath,
      universalElementPath,
    } = useEditorState();
    const { inited } = useEditorContext();

    const { ElementHover, ElementSelected, ElementPlaceholder } =
      useEditorProps();

    const path = ReactEditor.findPath(editor, props.element);

    const pathString = path.join("-");

    const isSelected = Boolean(
      selectedNodePath && Path.equals(selectedNodePath, path)
    );

    const isHover = Boolean(hoverNodePath && Path.equals(hoverNodePath, path));

    const isDragging = Boolean(dragNodePath && Path.equals(dragNodePath, path));

    const isFocus = selectedNodePath?.join("-").includes(pathString);

    const attributes = useMemo(() => {
      const map = { ...props.attributes };
      if (map) {
        (map as any)["data-slate-selected"] = isSelected || undefined;

        (map as any)["data-slate-hover"] = isHover || undefined;

        (map as any)["data-slate-dragging"] = isDragging || undefined;

        (map as any)["data-slate-focus"] = isFocus || undefined;
        (map as any)["data-slate-universal-editing"] =
          (universalElementPath && Path.equals(universalElementPath, path)) ||
          undefined;
      }

      return map;
    }, [
      isDragging,
      isFocus,
      isHover,
      isSelected,
      path,
      props.attributes,
      universalElementPath,
    ]);

    if (inited) {
      try {
      } catch (error) {}
    }

    useEffect(() => {
      try {
        if (inited) {
          const ele = ReactEditor.toDOMNode(editor, props.element);
          if (ele) {
            setNodeElement(ele);
            return;
          }
        }
      } catch (error) {}

      setNodeElement(null);
    }, [editor, inited, props.element]);

    const instance = useMemo(() => {
      return (
        <Com
          {...props}
          attributes={attributes}
          placeholder={
            <>
              {ElementPlaceholder && nodeElement && (
                <ElementPlaceholder
                  element={props.element}
                  isSelected={isSelected}
                  isHover={isHover}
                  nodeElement={nodeElement}
                  path={path}
                />
              )}
              {isHover && ElementHover && nodeElement && (
                <ElementHover
                  element={props.element}
                  isSelected={isSelected}
                  nodeElement={nodeElement}
                  path={path}
                />
              )}
              {isSelected && ElementSelected && nodeElement && (
                <ElementSelected
                  element={props.element}
                  isHover={isHover}
                  nodeElement={nodeElement}
                  path={path}
                />
              )}
            </>
          }
        ></Com>
      );
    }, [
      props,
      attributes,
      ElementPlaceholder,
      nodeElement,
      isSelected,
      isHover,
      path,
      ElementHover,
      ElementSelected,
    ]);

    return instance;
  };
};
