import { observer } from "mobx-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Transforms, Node, Editor, Text } from "slate";
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
import { store } from "@beacas-plugins/store";

export const MoreActionsMenusOverlay = observer(() => {
  const { visible, top, left } = store.ui.moreActionsMenusOverlay;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRefState(selectedIndex);
  const editor = useSlateStatic();

  const options: {
    title: string;
    content: string;
    image: string;
    onClick: (ev: Event) => any;
  }[] = useMemo(() => {
    return [
      {
        title: "Delete",
        content: "Del",
        image: deleteIcon,
        onClick(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          store.ui.setMoreActionsMenusOverlayVisible(false);
          Transforms.removeNodes(editor);
        },
      },
      {
        title: "Duplicate",
        content: "Ctrl D",
        image: duplicateIcon,
        onClick(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          if (!editor.selection?.focus.path) return;

          let node = Node.get(editor, editor.selection?.anchor.path);
          let nodePath = ReactEditor.findPath(editor, node);

          if (Text.isText(node)) {
            [node, nodePath] = Editor.parent(editor, nodePath);
          }
          store.ui.setMoreActionsMenusOverlayVisible(false);

          Transforms.insertNodes(editor, cloneDeep(node));
        },
      },
      {
        title: "Replace",
        content: "",
        image: replaceIcon,
        onClick(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          if (!editor.selection?.anchor.path) return;
          let node = Node.get(editor, editor.selection.anchor.path);
          if (Text.isText(node)) {
            node = Node.parent(editor, editor.selection.anchor.path);
          }
          const domNode = ReactEditor.toDOMNode(editor, node);
          const placeholderNode = domNode.querySelector(
            ".standard-image"
          ) as HTMLDivElement;
          if (placeholderNode) {
            store.ui.setMoreActionsMenusOverlayVisible(false);
            placeholderNode.click();
          }
        },
      },
      {
        title: "Full screen",
        content: "",
        image: screenIcon,
        onClick(ev) {
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
  }, [editor]);

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

      store.ui.setBlockMenusOverlayVisible(false);
    },
    [editor]
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
        onSelectItem(ev, filterOptions[selectedIndexRef.current].onClick(ev));
      } else if (ev.code === "Escape") {
        store.ui.setMoreActionsMenusOverlayVisible(false);
      }
    };

    const onBlur = () => {
      store.ui.setMoreActionsMenusOverlayVisible(false);
    };

    const root = ReactEditor.getWindow(editor);
    root.addEventListener("mousedown", onBlur);
    root.addEventListener("blur", onBlur);
    root.addEventListener("keydown", onKeydown);
    return () => {
      root.removeEventListener("mousedown", onBlur);
      root.removeEventListener("blur", onBlur);
      root.removeEventListener("keydown", onKeydown);
    };
  }, [editor, filterOptionsRef, onSelectItem, selectedIndexRef, visible]);

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
    if (!visible) {
      store.ui.setSearch("");
    }
  }, [visible]);

  useEffect(() => {
    setSelectedIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.ui.moreActionsMenusOverlay.visible]);

  if (!visible) return null;

  const list = (
    <div className="action-list">
      {options.map((option, oIndex) => {
        const matchIndex = options.findIndex((o) => o.title === option.title);
        return (
          <div
            className="action-list-item"
            key={oIndex}
            data-menu-index={oIndex}
            onMouseEnter={() => setSelectedIndex(matchIndex)}
            onMouseDown={option.onClick as any}
          >
            <div
              className={classnames(
                "action-list-item-inner",
                oIndex === selectedIndex && "action-list-item-inner-hover"
              )}
            >
              <div className="img">
                <img src={option.image} alt="" />
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
});
