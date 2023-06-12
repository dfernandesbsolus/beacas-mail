import { useRefState } from "beacas-editor";
import { flatMap } from "lodash";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useState } from "react";
import { Transforms, Editor } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import styleText from "./BlockMenusOverlay.scss?inline";
import { Element, classnames, ElementType, StandardType, t } from "beacas-core";
import { getElementPageLayout } from "@beacas-plugins/utils/getElementPageLayout";
import { store } from "@beacas-plugins/store";
import paragraphIcon from "@beacas-plugins/assets/images/elements/paragraph.png";
import heading1 from "@beacas-plugins/assets/images/elements/heading1.png";
import heading2 from "@beacas-plugins/assets/images/elements/heading2.png";
import heading3 from "@beacas-plugins/assets/images/elements/heading3.png";
import image from "@beacas-plugins/assets/images/elements/image.png";
import button from "@beacas-plugins/assets/images/elements/button.png";
import column from "@beacas-plugins/assets/images/elements/column.png";

const options: {
  title: string;
  options: {
    title: string;
    content: string;
    image: string;
    payload: Element;
  }[];
}[] = [
  {
    get title() {
      return t("Basic blocks");
    },
    options: [
      {
        get title() {
          return t("Paragraph");
        },
        get content() {
          return t("Just start writing with plain text.");
        },
        image: paragraphIcon,
        payload: {
          type: "standard-paragraph",
        } as Element,
      },
      {
        get title() {
          return t("Heading 1");
        },
        get content() {
          return t("Big section heading.");
        },
        image: heading1,
        payload: {
          type: ElementType.STANDARD_H1,
        } as Element,
      },
      {
        get title() {
          return t("Heading 2");
        },
        get content() {
          return t("Medium section heading.");
        },
        image: heading2,
        payload: {
          type: ElementType.STANDARD_H2,
        } as Element,
      },
      {
        get title() {
          return t("Heading 3");
        },
        get content() {
          return t("Small section heading.");
        },
        image: heading3,
        payload: {
          type: ElementType.STANDARD_H3,
        } as Element,
      },
      {
        get title() {
          return t("Heading 4");
        },
        get content() {
          return t("Small section heading.");
        },
        image: heading3,
        payload: {
          type: ElementType.STANDARD_H4,
        } as Element,
      },
      {
        get title() {
          return t("Image");
        },
        get content() {
          return t("Upload or embed with a link.");
        },
        image: image,
        payload: {
          type: ElementType.STANDARD_IMAGE,
        } as Element,
      },
      {
        get title() {
          return t("Button");
        },
        get content() {
          return t("Action button");
        },
        image: button,
        payload: {
          type: ElementType.STANDARD_BUTTON,
          children: [{ text: "Click" }],
        } as Element,
      },
      {
        get title() {
          return t("Column");
        },
        get content() {
          return t("Configure Column Layout");
        },
        image: column,
        payload: {
          type: ElementType.STANDARD_COLUMN,
          attributes: {},
          children: [{}],
        } as Element,
      },
    ],
  },
];

const flatOptions = flatMap(options.map((item) => item.options));

export const BlockMenusOverlay = observer(() => {
  const { visible } = store.ui.blockMenusOverlay;

  const [refElement, setRefElement] = useState<HTMLElement | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRefState(selectedIndex);
  const editor = useSlateStatic();

  useEffect(() => {
    const doc = ReactEditor.findDocumentOrShadowRoot(editor);
    const contentWindow = ReactEditor.getWindow(editor);
    if (!refElement || refElement.contains(doc.activeElement)) {
      return;
    }

    const domSelection = contentWindow.getSelection();
    if (!domSelection) return;
    try {
      const domRange = domSelection.getRangeAt(0);

      const layout = getElementPageLayout({
        editor,
        overlayElement: refElement,
        relativedElement: domRange,
      });

      if (!layout) return;

      const { isBottomEnough, iframeRect, relativedElementReact, overlayRect } =
        layout;

      refElement.style.opacity = "1";
      refElement.style.top = `${
        isBottomEnough
          ? relativedElementReact.height +
            relativedElementReact.top +
            iframeRect.top
          : relativedElementReact.top - overlayRect.height + iframeRect.top
      }px`;
      refElement.style.left = `${
        relativedElementReact.left + iframeRect.left
      }px`;
    } catch (error) {}
  });

  const onChooseItem = useCallback(
    (node: Element) => {
      const focus = editor.selection?.focus;
      if (!focus) return;
      const text = Editor.string(editor, focus.path);
      const index = text.lastIndexOf("/");
      const isEmptyText =
        !text || text.length === text.substring(index, focus.offset).length;

      const range = {
        anchor: { path: focus.path, offset: index },
        focus: { path: focus.path, offset: focus.offset },
      };

      Transforms.delete(editor, { at: range });
      if (!editor.selection) return;

      if (node.type === StandardType.STANDARD_COLUMN) {
        store.ui.serColumnsOverlayVisible(true);
      } else {
        if (isEmptyText) {
          editor.replaceNode({
            node,
            path: editor.selection.focus.path,
          });
        } else {
          Transforms.insertNodes(editor, node as any);
        }
      }

      store.ui.setBlockMenusOverlayVisible(false);
    },
    [editor]
  );

  const onSelectItem = useCallback(
    (ev: Event, node: Element) => {
      ev.stopPropagation();
      ev.preventDefault();
      onChooseItem(node);
    },
    [onChooseItem]
  );

  const filterOptions = flatOptions.filter((item) => {
    const isMatchQuery = item.title
      .toLowerCase()
      .includes(store.ui.blockMenusOverlay.search);

    return isMatchQuery;
  });
  const filterOptionsRef = useRefState(filterOptions);

  useEffect(() => {
    if (!visible) return;

    const onMouseDown = (ev: KeyboardEvent) => {
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

        onSelectItem(ev, filterOptions[selectedIndexRef.current].payload);
      } else if (ev.code === "Escape") {
        store.ui.setBlockMenusOverlayVisible(false);
      }
    };

    const onBlur = () => {
      store.ui.setBlockMenusOverlayVisible(false);
    };

    const root = ReactEditor.getWindow(editor);
    root.addEventListener("mousedown", onBlur);
    // root.addEventListener("blur", onBlur);
    root.addEventListener("keydown", onMouseDown);
    return () => {
      root.removeEventListener("mousedown", onBlur);
      root.removeEventListener("blur", onBlur);
      root.removeEventListener("keydown", onMouseDown);
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
  }, [store.ui.blockMenusOverlay.search]);

  useEffect(() => {
    if (refElement) {
    }
  }, [refElement]);

  if (!visible) return null;

  const isEmptySearch = filterOptions.length === 0;

  const list = options.map((item, index) => {
    const isEmpty = !filterOptions.some((fo) =>
      item.options.some((io) => io.title === fo.title)
    );
    if (isEmpty) return null;
    return (
      <div key={index}>
        <div className="content-type">{item.title}</div>
        <div className="list">
          {filterOptions.map((option, oIndex) => {
            const matchIndex = flatOptions.findIndex(
              (o) => o.title === option.title
            );
            return (
              <div
                className="list-item"
                key={oIndex}
                data-menu-index={oIndex}
                onMouseEnter={() => setSelectedIndex(matchIndex)}
                onMouseDown={(ev) => onSelectItem(ev as any, option.payload)}
              >
                <div
                  className={classnames(
                    "list-item-inner",
                    oIndex === selectedIndex && "list-item-inner-hover"
                  )}
                >
                  <div className="img">
                    <img src={option.image} alt="" />
                  </div>
                  <div className="content">
                    <div className="title">{option.title}</div>
                    <div className="desc">{option.content}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="beacas-overlay-container" ref={setRefElement}>
        <div className="beacas-overlay-wrapper">
          <div className="beacas-scrollbar scrollbar">
            {isEmptySearch ? <div className="list-empty">No result</div> : list}
          </div>
        </div>
      </div>
      <style>{styleText}</style>
    </>
  );
});
