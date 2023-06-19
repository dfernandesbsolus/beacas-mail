import { BlockManager, Element, ElementCategory, NodeUtils } from "beacas-core";
import { cloneDeep } from "lodash";
import React, { useEffect } from "react";
import { createContext } from "react";
import { Editor, Node, Path, Transforms } from "slate";
import { useSlate } from "slate-react";
import { useEditorProps, useEventCallback } from "..";

export enum ActiveTabKeys {
  MOBILE = "MOBILE",
  DESKTOP = "DESKTOP",
}

export interface InteractContextProps {
  universalElementEditing: boolean;
  universalElementPath: Path | null | undefined;
  setUniversalElementPath: React.Dispatch<
    React.SetStateAction<Path | null | undefined>
  >;
  activeTab: ActiveTabKeys;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTabKeys>>;
  selectedNodePath: Path | null;
  setSelectedNodePath: (path?: Path | null) => void;
  hoverNodePath: Path | null | undefined;
  setHoverNodePath: React.Dispatch<
    React.SetStateAction<Path | null | undefined>
  >;
  dragNodePath: Path | null;
  setDragNodePath: React.Dispatch<React.SetStateAction<Path | null>>;
  lock: boolean;
  setLock: React.Dispatch<React.SetStateAction<boolean>>;
  initialUniversalElement: Element | null;
}

export const InteractContext = createContext<InteractContextProps>({} as any);

export const InteractProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { localeData, readOnly } = useEditorProps();
  const editor = useSlate();

  useEffect(() => {
    setHoverNodePath([0]);
    setHoverNodePath(undefined);
    const timer = setTimeout(() => {
      setHoverNodePath(null);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [editor, localeData]);

  const [lock, setLock] = React.useState(false);
  const [selectedNodePath, setSelectedNodePath] = React.useState<Path | null>(
    null
  );
  const [universalElementPath, setUniversalElementPath] = React.useState<
    Path | null | undefined
  >(null);

  const [initialUniversalElement, setInitialUniversalElement] =
    React.useState<Element | null>(null);

  const [hoverNodePath, setHoverNodePath] = React.useState<
    Path | null | undefined
  >(null);
  const [activeTab, setActiveTab] = React.useState<ActiveTabKeys>(
    ActiveTabKeys.DESKTOP
  );
  const [dragNodePath, setDragNodePath] = React.useState<Path | null>(null);

  const setSelectedNodePathHandler = useEventCallback((path?: Path | null) => {
    if (readOnly) return;
    if (lock) return;
    if (!path) {
      Transforms.deselect(editor);
    } else {
      const node = Node.get(editor, path);
      const end = Editor.end(editor, path);
      const isUnsetElement = Editor.above(editor, {
        at: end,
        match(node) {
          return NodeUtils.isUnsetElement(node);
        },
      });

      if (isUnsetElement) {
        Transforms.deselect(editor);
      } else if (!editor.selection && NodeUtils.isContentElement(node)) {
        const range = { anchor: end, focus: end };
        Transforms.select(editor, range);
      }
    }

    setSelectedNodePath((oldPath) => {
      if (!path) return null;
      if (oldPath && Path.equals(oldPath, path)) return oldPath;

      return path;
    });
  });

  const setHoverNodePathHandle = useEventCallback(
    (...args: Parameters<typeof setHoverNodePath>) => {
      return setHoverNodePath(...args);
    }
  );

  useEffect(() => {
    if (universalElementPath) {
      const element = Node.get(editor, universalElementPath) as Element;
      setInitialUniversalElement(cloneDeep(element));
    } else {
      setInitialUniversalElement(null);
    }
  }, [editor, universalElementPath]);

  let node: Node | null = null;

  try {
    node = selectedNodePath && Node.get(editor, selectedNodePath);
  } catch (error) {}

  useEffect(() => {
    if (node && NodeUtils.isElement(node)) {
      const block = BlockManager.getBlockByType(node.type);
      if (
        ([ElementCategory.RAW, ElementCategory.UNSET] as any[]).includes(
          block.category
        )
      ) {
        setSelectedNodePath(null);
      }
    }
  }, [node]);

  const data = React.useMemo(() => {
    return {
      universalElementEditing: Boolean(universalElementPath),
      selectedNodePath,
      hoverNodePath,
      dragNodePath,
      setSelectedNodePath: setSelectedNodePathHandler,
      setHoverNodePath: setHoverNodePathHandle,
      setDragNodePath,
      activeTab,
      setActiveTab,
      universalElementPath,
      setUniversalElementPath,
      initialUniversalElement,
      lock,
      setLock,
    };
  }, [
    activeTab,
    dragNodePath,
    hoverNodePath,
    selectedNodePath,
    setHoverNodePathHandle,
    setSelectedNodePathHandler,
    universalElementPath,
    setUniversalElementPath,
    initialUniversalElement,
    lock,
    setLock,
  ]);

  return (
    <InteractContext.Provider value={data}>{children}</InteractContext.Provider>
  );
};
