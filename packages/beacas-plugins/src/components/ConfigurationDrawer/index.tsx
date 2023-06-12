import { Drawer } from "@arco-design/web-react";
import { useEditorState } from "beacas-editor";
import React, { useCallback, useMemo, useState } from "react";
import { SharedComponents } from "..";

export const ConfigurationDrawer = ({
  height,
  onClose: propsOnClose,
}: {
  height: string;
  onClose: () => void;
}) => {
  const { selectedNodePath, setSelectedNodePath } = useEditorState();
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const visible =
    Boolean(selectedNodePath) && selectedNodePath?.join("") !== "0";

  const onClose = useCallback(() => {
    propsOnClose();
    setSelectedNodePath(null);
  }, [propsOnClose, setSelectedNodePath]);

  return useMemo(() => {
    return (
      <>
        <div
          id="ConfigurationDrawer"
          ref={setRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            pointerEvents: visible ? "auto" : "none",
            display: visible ? "block" : "none",
          }}
        />
        {ref && (
          <Drawer
            width="100%"
            title={null}
            closable={false}
            focusLock={false}
            placement="left"
            bodyStyle={{ padding: 0, transition: "none" }}
            visible={visible}
            getPopupContainer={() => ref}
            footer={null}
            onCancel={onClose}
          >
            <SharedComponents.ConfigurationPanel
              showSourceCode
              height={height}
              onClose={onClose}
            />
            <style>{`#ConfigurationDrawer .arco-drawer { transform: none !important; }`}</style>
          </Drawer>
        )}
      </>
    );
  }, [visible, ref, onClose, height]);
};
