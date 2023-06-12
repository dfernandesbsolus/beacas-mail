import React, { useCallback, useState } from "react";
import { Collapse, Space } from "@arco-design/web-react";

export interface CollapseWrapperProps {
  defaultActiveKey: string[];
  enabledLogic?: boolean;
  children: React.ReactNode;
}

export const CollapseWrapper: React.FC<CollapseWrapperProps> = (props) => {
  const [activeKeys, setActiveKeys] = useState<string[]>(
    props.defaultActiveKey
  );

  const onChange = useCallback((key: string, keys: string[]) => {
    setActiveKeys(keys);
  }, []);

  return (
    <Space size="large" direction="vertical" style={{ width: "100%" }}>
      <Collapse bordered={false} onChange={onChange} activeKey={activeKeys}>
        {props.children}
      </Collapse>
      <div />
      <div />
      <div />
    </Space>
  );
};
