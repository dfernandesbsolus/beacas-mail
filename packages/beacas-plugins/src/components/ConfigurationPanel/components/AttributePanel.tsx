import React, { useMemo } from "react";

import { useSelectedNode } from "beacas-editor";
import { ConfigPanelsMap } from "../Elements";

export const AttributePanel = () => {
  const { selectedNode, selectedNodePath } = useSelectedNode();

  const nodePath = useMemo(() => selectedNodePath, [selectedNodePath]);

  return useMemo(() => {
    if (!selectedNode || !nodePath) return null;

    const Com = ConfigPanelsMap[selectedNode.type];
    if (!Com) return <div>No match component {selectedNode.type}</div>;
    return (
      <Com nodePath={nodePath} key={selectedNode.type + nodePath.toString()} />
    );
  }, [nodePath, selectedNode]);
};
