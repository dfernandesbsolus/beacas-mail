import { Space, Tooltip } from "@arco-design/web-react";
import {
  IconMinus,
  IconPlus,
  IconRedo,
  IconUndo,
} from "@arco-design/web-react/icon";
import React, { useCallback, useEffect, useState } from "react";
import "./index.scss";
import { ReactEditor, useSlate } from "slate-react";
import { t } from "beacas-core";
import { store } from "@beacas-plugins/store";
import { observer } from "mobx-react";
import { useEditorContext } from "beacas-editor";
import { createPortal } from "react-dom";

export const Controller = observer(() => {
  const editor = useSlate();

  const getRoot = () => {
    try {
      return ReactEditor.getWindow(editor).document;
    } catch (error) {
      return null;
    }
  };
  const root = getRoot();

  const { zoom } = store.editorState.state;
  const { inited } = useEditorContext();

  const [offset, setOffset] = useState({
    left: 0,
    bottom: 80,
  });

  const dragEleRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!inited) return;

    const contentWindow = ReactEditor.getWindow(editor);
    const iframe = [...document.querySelectorAll("iframe")].find(
      (item) => item.contentWindow === contentWindow
    );
    if (!iframe) return;

    const { left, width } = iframe.getBoundingClientRect();
    setOffset({
      left: left + width - 50,
      bottom: 10,
    });
  }, [editor, inited]);

  const onIncrease = useCallback(() => {
    store.editorState.setZoom(Math.min(150, zoom + 10));
  }, [zoom]);

  const onReduce = useCallback(() => {
    store.editorState.setZoom(Math.max(50, zoom - 10));
  }, [zoom]);

  const undoable = editor.history.undos.length > 1;
  const redoable = editor.history.redos.length > 0;

  return (
    <>
      <div
        className="beacas-editor-controller"
        ref={dragEleRef}
        style={{
          position: "fixed",
          bottom: offset.bottom,
          left: offset.left,
          zIndex: 11,
          cursor: "grab",
        }}
      >
        <div style={{ cursor: "default" }}>
          <Space>
            <span className="controller-item" data-enable={undoable}>
              <Tooltip position="top" content={t("Undo")}>
                <IconUndo onClick={editor.undo} />
              </Tooltip>
            </span>

            <span className="controller-item" data-enable={redoable}>
              <Tooltip position="top" content={t("Redo")}>
                <IconRedo onClick={editor.redo} />
              </Tooltip>
            </span>

            <span className="controller-item" data-enable={zoom < 150}>
              <Tooltip position="top" content={t("Zoom in")}>
                <IconPlus onClick={onIncrease} />
              </Tooltip>
            </span>
            <span>
              <Tooltip position="top" content={"Zoom" + `: ${zoom}%`}>
                <span
                  style={{
                    fontSize: 12,
                    display: "inline-block",
                    width: "3em",
                    textAlign: "center",
                  }}
                >
                  {zoom}%
                </span>
              </Tooltip>
            </span>
            <span className="controller-item" data-enable={zoom > 50}>
              <Tooltip position="top" content={t("Zoom out")}>
                <IconMinus onClick={onReduce} />
              </Tooltip>
            </span>
          </Space>
        </div>
      </div>
      {root?.body &&
        createPortal(
          <style>
            {`
            #beacas-editor {
              transform: scale(${zoom}%);
              transformOrigin: top center;
            }
            `}
          </style>,
          root?.body
        )}
    </>
  );
});
