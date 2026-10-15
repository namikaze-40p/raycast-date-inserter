import { useMemo } from "react";
import { toDataUri } from "./svg";

/**
 * Returns a function that turns rendered SVGs into data URIs, memoized by key.
 * Raycast shows an image without flicker once it has loaded that exact URI,
 * so the same string must be reused whenever the same state comes back.
 */
export function useImageCache(): (key: string, render: () => string) => string {
  const cache = useMemo(() => new Map<string, string>(), []);
  return (key, render) => {
    let uri = cache.get(key);
    if (!uri) {
      uri = toDataUri(render());
      cache.set(key, uri);
    }
    return uri;
  };
}
