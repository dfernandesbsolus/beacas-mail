import { UniversalElementProviderContext } from "@beacas-plugins/components/Providers/UniversalElementProvider";
import { useContext } from "react";

export const useUniversalContent = () => {
  return useContext(UniversalElementProviderContext);
};
