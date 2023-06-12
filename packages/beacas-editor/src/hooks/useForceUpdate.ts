import { useCallback, useState } from "react";

export const useForceUpdate = () => {
  const [count, setCount] = useState(0);

  const forceUpdate = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return {
    forceUpdate,
    count,
  };
};
