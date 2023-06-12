import React from "react";

export function getMediaQuery(
  className: string,
  { parsedWidth, unit }: { parsedWidth: string | number; unit: string },
  breakpoint: string
) {
  const mediaQuery = `{ width:${parsedWidth}${unit} !important; max-width: ${parsedWidth}${unit}; }`;

  const baseMediaQuery = `.${className} ${mediaQuery}`;
  const thunderbirdMediaQuery = `.moz-text-html .${className} ${mediaQuery}`;

  return (
    <>
      <style type="text/css">
        {`@media only screen and (min-width:${breakpoint}) {${baseMediaQuery}`}
      </style>
      <style media={`screen and (min-width:${breakpoint})`}>
        {thunderbirdMediaQuery}
      </style>
    </>
  );
}
