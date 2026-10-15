import { useEffect, useMemo, useState } from "react";
import { HoldOptions, UpdateScheduler } from "./update-scheduler";

/**
 * State whose changes apply immediately but reach the screen only as often as
 * Raycast can keep up with; see `UpdateScheduler`.
 */
export function useThrottledState<T>(initial: T) {
  const [shown, setShown] = useState(initial);
  const scheduler = useMemo(() => new UpdateScheduler(initial, setShown), []);
  useEffect(() => () => scheduler.dispose(), [scheduler]);

  const update = (next: (current: T) => T, hold?: HoldOptions<T>) => scheduler.update(next, hold);
  return [shown, update] as const;
}
