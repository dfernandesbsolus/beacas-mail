import { useContext, useMemo } from "react";

import { Element } from "beacas-core";
import { DraggingProviderContext } from "@beacas-plugins/components/Providers";

export const useDragging = ({
  element,
  nodeElement,
  action,
  cloneGhost,
}: {
  element: Element;
  nodeElement?: HTMLElement | null;
  action: "move" | "copy";
  cloneGhost?: boolean;
}) => {
  const { propsDataRef, ...context } = useContext(DraggingProviderContext);

  const dragHandle = useMemo(() => {
    return {
      ...context.dragHandle,
      onDragStart: (e: any) => {
        propsDataRef.current = {
          element,
          nodeElement: nodeElement || null,
          action: action || "copy",
          cloneGhost,
        };
        context.dragHandle.onDragStart(e);
      },
    };
  }, [
    action,
    cloneGhost,
    context.dragHandle,
    element,
    nodeElement,
    propsDataRef,
  ]);

  return { dragHandle };
};
