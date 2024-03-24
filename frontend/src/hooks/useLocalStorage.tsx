import { useEffect, useState } from "react";

const useLocalStorage = (key: string) => {
  const [value, setValue] = useState<string | null>(() => {
    return window.localStorage.getItem(key);
  });

  useEffect(() => {
    const listener = () => {
      setValue(window.localStorage.getItem(key));
    };

    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key]);

  function setLocalStorageValue(data: string) {
    setValue(data);
    localStorage.setItem(key, data);
  }

  function removeItem() {
    setValue(null);
    localStorage.removeItem(key);
  }

  return [value, setLocalStorageValue, removeItem] as const;
};

export default useLocalStorage;
