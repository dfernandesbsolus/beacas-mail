import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Transforms, Editor } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import styleText from "./MoreActionsMenusOverlay.scss?inline";

import duplicateIcon from "@beacas-plugins/assets/images/icons/duplicate-icon.svg";
import deleteIcon from "@beacas-plugins/assets/images/icons/delete-icon.svg";
import replaceIcon from "@beacas-plugins/assets/images/icons/replace-icon.svg";
import screenIcon from "@beacas-plugins/assets/images/icons/fullscreen-icon.svg";
import { cloneDeep } from "lodash";
import { Modal } from "@arco-design/web-react";
import {
  Element,
  classnames,
  StandardImageElement,
  NodeUtils,
  ElementType,
} from "beacas-core";
import { useRefState } from "beacas-editor";

export interface MoreActionsMenusOverlayProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  top: number;
  left: number;
  onToggleImageActionVisible: (ev: Event) => void;
  moreIconRef: React.RefObject<HTMLDivElement | null>;
}

export const MoreActionsMenusOverlay = (
  props: MoreActionsMenusOverlayProps
) => {
  const {
    visible,
    top,
    left,
    setVisible,
    onToggleImageActionVisible,
    moreIconRef,
  } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRefState(selectedIndex);
  const editor = useSlateStatic();

  const options: {
    title: string;
    content: string;
    image: string;
    onPointerdown: (ev: Event) => any;
  }[] = useMemo(() => {
    return [
      {
        title: "Delete",
        content: "Del",
        image: deleteIcon,
        onPointerdown(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          setVisible(false);
          Transforms.removeNodes(editor);
        },
      },
      {
        title: "Duplicate",
        content: "Ctrl D",
        image: duplicateIcon,
        onPointerdown(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          if (!editor.selection?.focus.path) return;

          const nodeEntry = Editor.above(editor, {
            at: editor.selection,
            match: NodeUtils.isImageElement,
          });

          if (nodeEntry) {
            setVisible(false);

            Transforms.insertNodes(editor, cloneDeep(nodeEntry[0]));
          } else {
            console.log("nodeEntry not found");
          }
        },
      },
      {
        title: "Replace",
        content: "",
        image: replaceIcon,
        onPointerdown(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          if (!editor.selection?.anchor.path) return;
          const nodeEntry = Editor.above(editor, {
            at: editor.selection,
            match: NodeUtils.isImageElement,
          });
          if (!nodeEntry) {
            console.log("nodeEntry not found");
            return;
          }
          const domNode = ReactEditor.toDOMNode(editor, nodeEntry[0]);
          const placeholderNode = domNode.querySelector(
            ".beacas-image-action"
          ) as HTMLDivElement;

          if (placeholderNode) {
            setVisible(false);
            onToggleImageActionVisible(ev);
          } else {
            console.log("placeholderNode not found");
          }
        },
      },
      {
        title: "Full screen",
        content: "",
        image: screenIcon,
        onPointerdown(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          const [nodeEntry] = Editor.nodes(editor, {
            match(node) {
              return (
                NodeUtils.isElement(node) &&
                node.type === ElementType.STANDARD_IMAGE
              );
            },
          });
          const node = nodeEntry?.[0] as StandardImageElement;
          if (!node) return;

          Modal.info({
            wrapStyle: { padding: 0, backgroundColor: "transparent" },
            style: { padding: 0, backgroundColor: "transparent" },
            icon: null,
            title: null,
            footer: null,
            content: (
              <div>
                <img src={node.attributes.src} alt="" />
              </div>
            ),
          });
        },
      },
    ];
  }, [editor, onToggleImageActionVisible, setVisible]);

  const onChooseItem = useCallback(
    (node: Partial<Element>) => {
      const anchor = editor.selection?.focus;
      if (!anchor) return;

      const isEmptyText =
        !Editor.string(editor, anchor.path) ||
        Editor.string(editor, anchor.path) === "/";

      const range = {
        anchor: anchor,
        focus: { path: anchor.path, offset: anchor.offset - 1 },
      };
      Transforms.delete(editor, { at: range });

      if (isEmptyText) {
        editor.replaceNode({
          node,
          path: anchor.path,
        });
      } else {
        Transforms.insertNodes(editor, node as Element);
      }

      setVisible(false);
    },
    [editor, setVisible]
  );

  const onSelectItem = useCallback(
    (ev: Event, node: Partial<Element>) => {
      ev.stopPropagation();
      ev.preventDefault();
      ev.stopPropagation();
      onChooseItem(node);
    },
    [onChooseItem]
  );

  const filterOptions = options.filter((item) => {
    const isMatchQuery = item.title.toLowerCase().includes("");

    return isMatchQuery;
  });
  const filterOptionsRef = useRefState(filterOptions);

  useEffect(() => {
    if (!visible) return;
    const onKeydown = (ev: KeyboardEvent) => {
      const filterOptions = filterOptionsRef.current;

      if (ev.code === "ArrowDown") {
        ev.preventDefault();
        setSelectedIndex((oldIndex) => {
          return oldIndex < filterOptions.length - 1 ? oldIndex + 1 : 0;
        });
      } else if (ev.code === "ArrowUp") {
        ev.preventDefault();
        setSelectedIndex((oldIndex) => {
          return oldIndex === 0 ? filterOptions.length - 1 : oldIndex - 1;
        });
      } else if (ev.code === "Enter") {
        ev.preventDefault();
        if (!filterOptions[selectedIndexRef.current]) return;
        onSelectItem(
          ev,
          filterOptions[selectedIndexRef.current].onPointerdown(ev)
        );
      } else if (ev.code === "Escape") {
        setVisible(false);
      }
    };

    const onBlur = (ev: Event) => {
      if (moreIconRef.current?.contains(ev.target as any)) return;

      setVisible(false);
    };

    const root = ReactEditor.getWindow(editor);
    window.addEventListener("pointerdown", onBlur);
    root.addEventListener("pointerdown", onBlur);
    root.addEventListener("blur", onBlur);
    root.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("pointerdown", onBlur);
      root.removeEventListener("pointerdown", onBlur);
      root.removeEventListener("blur", onBlur);
      root.removeEventListener("keydown", onKeydown);
    };
  }, [
    editor,
    filterOptionsRef,
    moreIconRef,
    onSelectItem,
    selectedIndexRef,
    setVisible,
    visible,
  ]);

  useEffect(() => {
    const domNode = document.querySelector(
      `[data-menu-index="${selectedIndex}"]`
    );
    if (domNode) {
      domNode.scrollIntoView({
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const list = (
    <div className="action-list">
      {options.map((option, oIndex) => {
        const matchIndex = options.findIndex((o) => o.title === option.title);
        const ImageIcon = option.image;
        return (
          <div
            className="action-list-item"
            key={oIndex}
            data-menu-index={oIndex}
            onMouseEnter={() => setSelectedIndex(matchIndex)}
            onPointerDown={option.onPointerdown as any}
          >
            <div
              className={classnames(
                "action-list-item-inner",
                oIndex === selectedIndex && "action-list-item-inner-hover"
              )}
            >
              <div className="img">
                <ImageIcon />
              </div>
              <div className="content">
                <div className="title">{option.title}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="beacas-overlay-container" style={{ left, top }}>
        <div className="beacas-overlay-wrapper">
          <div className="beacas-scrollbar scrollbar">{list}</div>
        </div>
      </div>
      <style>{styleText}</style>
    </>
  );
};
