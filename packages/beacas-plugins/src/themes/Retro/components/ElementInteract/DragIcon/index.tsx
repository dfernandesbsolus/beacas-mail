import React from "react";
import DragIconSvg from "@beacas-plugins/assets/images/icons/drag-icon.svg";
import { classnames } from "beacas-editor";

export const DragIcon = ({
  setEleRef,
}: {
  setEleRef?: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}) => {
  return (
    <div
      ref={setEleRef}
      role="button"
      draggable={Boolean(setEleRef)}
      className={classnames("button drag-icon")}
    >
      <DragIconSvg />
    </div>
  );
};
