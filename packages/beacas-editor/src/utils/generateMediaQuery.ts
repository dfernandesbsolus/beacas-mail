export const generateMediaQuery = (
  className: string,
  { parsedWidth, unit }: { parsedWidth: string | number; unit: string },
) => {
  return {
    [className]: `{ width:${parsedWidth}${unit} !important; max-width: ${parsedWidth}${unit}; }`,
  };
};
