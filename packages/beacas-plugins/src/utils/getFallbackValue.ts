import { ActiveTabKeys } from "beacas-editor";
import { get } from "lodash";
import { useElementDefault } from "..";

export const getFallbackValue = (params: {
  mode: ActiveTabKeys;
  defaultElement?: ReturnType<typeof useElementDefault> | null;
  name: string;
}) => {
  const { mode, name, defaultElement } = params;
  if (!defaultElement) return undefined;
  return mode === ActiveTabKeys.DESKTOP
    ? get(defaultElement, "attributes." + name)
    : get(defaultElement, "mobileAttributes." + name);
};
