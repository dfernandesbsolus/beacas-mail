const unitRegex = /[\d.,]*(\D*)$/;

export function widthParser(
  width: string | number,
  options: { parseFloatToInt?: boolean } = {},
) {
  const { parseFloatToInt = true } = options;

  const widthUnit = unitRegex.exec(width.toString())![1];
  const unitParsers = {
    default: parseInt,
    px: parseInt,
    '%': parseFloatToInt ? parseInt : parseFloat,
  };
  const parser = (unitParsers as any)[widthUnit] || unitParsers.default;

  return {
    parsedWidth: parser(width),
    unit: widthUnit || 'px',
  };
}
