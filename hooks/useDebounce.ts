import { useEffect, useState } from "react";

const useDebounce = (value: string) => {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setQuery(value), 500);
    return () => clearTimeout(timeoutId);
  }, [value]);

  return query;
};

export default useDebounce;
