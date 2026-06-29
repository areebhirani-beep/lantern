"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `callback` when a pointer/touch event occurs outside of `ref`.
 * Small local hook so the vendored Vengeance components (e.g. the expandable
 * bento grid) work without pulling in an external dependency.
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      callback(event);
    }

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}

export default useOutsideClick;
