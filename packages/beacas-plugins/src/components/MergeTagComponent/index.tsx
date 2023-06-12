import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Select, SelectProps } from "@arco-design/web-react";

import { useEditorProps, useRefState } from "beacas-editor";
import { ReactEditor, useSlate } from "slate-react";

export const MergeTagComponent: React.FC<
  {
    onChange: (v: string) => void;
    value: string;
    onClose?: () => void;
  } & SelectProps
> = React.memo((props) => {
  const editorPorps = useEditorProps();
  const ref = useRef<HTMLDivElement | null>(null);
  const onCloseRef = useRefState(props.onClose);
  const editor = useSlate();

  const mergetags = useMemo(
    () => editorPorps.mergetags || [],
    [editorPorps.mergetags]
  );

  const onSelect = useCallback(
    (key: string) => {
      props.onChange(key);
    },
    [props]
  );

  let root: Window | null = null;
  try {
    root = ReactEditor.getWindow(editor);
  } catch (error) {}

  useEffect(() => {
    if (!root) return;

    const onKeyDown = (ev: KeyboardEvent) => {
      if (
        ev.code.toLowerCase() === "enter" &&
        ref.current?.contains(document.activeElement)
      ) {
        if (document.activeElement instanceof HTMLElement) {
          ev.preventDefault();
          document.activeElement.click();
        }
      } else if (
        ev.code.toLowerCase() === "escape" ||
        ev.code.toLowerCase() === "backquote"
      ) {
        ev.preventDefault();
        onCloseRef.current?.();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    root.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      root?.removeEventListener("keydown", onKeyDown, true);
    };
  }, [editor, onCloseRef, root]);

  return (
    <>
      <Select
        triggerProps={{
          style: {
            width: 300,
          },
          position: "br",
        }}
        showSearch
        {...props}
        onChange={onSelect}
      >
        {mergetags.map((item, index) => {
          if (item.children) {
            return (
              <Select.OptGroup label={item.label} key={item.label + index}>
                {item.children.map((child, cIndex) => {
                  return (
                    <Select.Option
                      value={child.value}
                      key={child.label + cIndex}
                    >
                      {child.label}
                    </Select.Option>
                  );
                })}
              </Select.OptGroup>
            );
          }
          return (
            <Select.Option value={item.value} key={item.label + index}>
              {item.label}
            </Select.Option>
          );
        })}
      </Select>
    </>
  );
});
