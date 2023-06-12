import React, { useCallback, useState } from "react";
import { useSlate } from "slate-react";
import { FormatButton } from "./FormatButton";
import { MergeTagComponent } from "@beacas-plugins/components/MergeTagComponent";
import { t } from "beacas-core";

export interface MergeTagTreeNode {
  key: any;
  value: string;
  title: string;
  children: MergeTagTreeNode[];
}

export const MergeTag = React.memo(() => {
  const [popupVisible, setPopupVisible] = useState(false);
  const value = "";
  const editor = useSlate();

  const onChange = useCallback(
    (mergetag: string) => {
      editor.insertMergetag({
        mergetag,
      });
      setPopupVisible(false);
    },
    [editor]
  );

  const onClose = useCallback(() => {
    setPopupVisible(false);
  }, []);

  return (
    <MergeTagComponent
      popupVisible={popupVisible}
      onVisibleChange={setPopupVisible}
      onChange={onChange}
      onClose={onClose}
      value={value}
      triggerElement={
        <FormatButton
          title={t("Merge Tag")}
          icon="icon-merge-tags"
          onClick={() => setPopupVisible(false)}
        />
      }
    />
  );
});
