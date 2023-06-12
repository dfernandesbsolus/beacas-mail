export const isDOMElement = (value: any): value is HTMLElement => {
  return isDOMNode(value) && value.nodeType === 1;
};

export const isDOMNode = (value: any): value is Node => {
  const window = getDefaultView(value);
  return (
    !!window && value instanceof window.Node && value instanceof window.Node
  );
};

export const getDefaultView = (value: any): Window | null => {
  return (
    (value && value.ownerDocument && value.ownerDocument.defaultView) || null
  );
};
