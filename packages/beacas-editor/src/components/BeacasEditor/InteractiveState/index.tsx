import { useEditorProps } from "@beacas-editor/hooks/useEditorProps";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export const InteractiveState = () => {
  const { interactiveStyle = {} } = useEditorProps();

  const [interactiveStyleColor, setInteractiveStyleColor] = React.useState<{
    hoverColor?: string;
    selectedColor?: string;
    dragColor?: string;
  }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const interactiveStyleColor = {
        ...interactiveStyle,
      };
      const style = getComputedStyle(document.body);
      interactiveStyleColor.hoverColor = `rgb(${
        style.getPropertyValue("--primary-4") || "24,144,255"
      })`;
      interactiveStyleColor.dragColor = `rgb(${
        style.getPropertyValue("--primary-4") || "24,144,255"
      })`;
      interactiveStyleColor.selectedColor = `rgb(${
        style.getPropertyValue("--primary-6") || "24,144,255"
      })`;
      setInteractiveStyleColor((old) => {
        if (JSON.stringify(old) === JSON.stringify(interactiveStyleColor)) {
          return old;
        }
        return interactiveStyleColor;
      });
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, [interactiveStyle]);

  return (
    <>
      <style>
        {`
       * {
        --hover-color: ${interactiveStyleColor.hoverColor};
        --selected-color: ${interactiveStyleColor.selectedColor};
        --drag-color: ${interactiveStyleColor.dragColor};
      }`}
      </style>
      {createPortal(
        <style>
          {`
       * {
        --hover-color: ${interactiveStyleColor.hoverColor};
        --selected-color: ${interactiveStyleColor.selectedColor};
        --drag-color: ${interactiveStyleColor.dragColor};
      }`}
        </style>,
        document.body
      )}
    </>
  );
};
