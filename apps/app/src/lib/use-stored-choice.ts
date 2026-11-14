"use client";

import { useEffect, useState } from "react";

// A choice remembered on this device under the given key; parse must be a stable function.
export function useStoredChoice<T extends string>(key: string, parse: (value: string | null) => T) {
  const [choice, setChoice] = useState(() => parse(null));

  useEffect(() => {
    try {
      setChoice(parse(localStorage.getItem(key)));
    } catch {}
  }, [key, parse]);

  const choose = (value: T) => {
    setChoice(value);
    try {
      localStorage.setItem(key, value);
    } catch {}
  };

  return [choice, choose] as const;
}
