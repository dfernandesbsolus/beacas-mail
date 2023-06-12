import { classnames, t } from "beacas-core";
import { EmailEditorProps } from "beacas-editor";
import React, { useCallback, useState } from "react";
import stylesText from "./MergetagPopover.scss?inline";

export const MergetagPopover: EmailEditorProps["MergetagPopover"] = ({
  element,
  onSave,
}) => {
  const [text, setText] = useState(element.data.default || "");

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (ev) => {
      setText(ev.target.value);
      onSave(ev.target.value);
    },
    [onSave]
  );

  return (
    <div className={classnames("beacas-merge-tag-popover")}>
      <div className="beacas-merge-tag-popover-container">
        <h3>
          <span>{t("Default value")}</span>
          {/* <IconFont
            style={{ color: "rgb(92, 95, 98)" }}
            iconName="icon-close"
            onClick={onClose}
          /> */}
        </h3>
        <div className={"beacas-merge-tag-popover-desc"}>
          <p>
            {t(
              'If a personalized text value isn"t available, then a default value is shown.'
            )}
          </p>
          <div className="beacas-merge-tag-popover-desc-label">
            <input
              autoFocus
              value={text}
              onChange={onChange}
              type="text"
              autoComplete="off"
              maxLength={40}
            />
            <div className="beacas-merge-tag-popover-desc-label-count">
              {text.length}/40
            </div>
          </div>
          {/* <div className="beacas-merge-tag-popover-desc-label-button">
            <button onClick={onHandleSave}>{t("Save")}</button>
          </div> */}
        </div>
      </div>
      <style>{stylesText}</style>
    </div>
  );
};
