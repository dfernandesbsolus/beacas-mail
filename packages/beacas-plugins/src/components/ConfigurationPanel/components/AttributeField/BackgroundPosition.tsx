import React, { useMemo, useRef } from "react";

import {
  enhancer,
  EnhancerProps,
} from "@beacas-plugins/components/Form/enhancer";
import { Path } from "slate";

const positionOptions = [
  [
    ["top", "left"],
    ["top", "center"],
    ["top", "right"],
  ],
  [
    ["center", "left"],
    ["center", "center"],
    ["center", "right"],
  ],
  [
    ["bottom", "left"],
    ["bottom", "center"],
    ["bottom", "right"],
  ],
];

function BackgroundPositionContent(
  props: EnhancerProps & {
    path: Path;
    onChange: (val: string) => void;
    value: string;
  }
) {
  const divRef = useRef(document.createElement("div"));

  const positionStyle = useMemo(() => {
    const div = divRef.current;
    div.style.backgroundPosition = props.value;
    return {
      y: div.style.backgroundPositionY,
      x: div.style.backgroundPositionX,
    };
  }, [props.value]);

  return useMemo(() => {
    return (
      <div
        style={{
          borderRadius: 5,
          overflow: "hidden",
          display: "inline-block",
        }}
      >
        {positionOptions.map((rowOptions, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              {rowOptions.map((item, rIndex) => {
                const isActive =
                  positionStyle.y === item[0] && positionStyle.x === item[1];
                return (
                  <div
                    key={rIndex}
                    style={{
                      display: "flex",
                      marginTop: index === 0 ? undefined : "4px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 45,
                        height: 30,
                        backgroundColor: isActive
                          ? "rgb(var(--primary-6))"
                          : "#ccc",
                        marginLeft: rIndex === 0 ? undefined : "4px",
                      }}
                      onClick={() => props.onChange(`${item[0]} ${item[1]}`)}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }, [positionStyle.x, positionStyle.y, props]);
}

export const BackgroundPosition = enhancer(BackgroundPositionContent);
