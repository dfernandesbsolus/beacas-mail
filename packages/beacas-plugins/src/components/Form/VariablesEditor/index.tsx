import React, { Suspense, useCallback, useMemo } from "react";

import { useEditorContext } from "beacas-editor";
import { Spin } from "@arco-design/web-react";

const VariablesEditorContent = React.lazy(
  () => import("./VariablesEditorContent")
);

export const VariablesEditorField = () => {
  const { mergetagsData, setMergetagsData } = useEditorContext();
  const initValue = useMemo(
    () => JSON.stringify(mergetagsData, null, 2),
    [mergetagsData]
  );

  const onChange = useCallback(
    (val: string) => {
      try {
        setMergetagsData(JSON.parse(val));
      } catch (error: any) {
        console.error(error?.message || error);
      }
    },
    [setMergetagsData]
  );

  return (
    <Suspense
      fallback={
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size={48} />
        </div>
      }
    >
      <VariablesEditorContent initialValue={initValue} onChange={onChange} />
    </Suspense>
  );
};
