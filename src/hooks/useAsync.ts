import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

export type AsyncResult<T> = AsyncState<T> & { reload: () => void };

/**
 * Runs an async loader (normally a function from src/services) and exposes
 * loading / error / success states. The loader re-runs whenever `deps` change
 * or `reload()` is called. Pages use this instead of fetching directly.
 *
 * When `reload()` is called after a successful load, the previous data stays
 * visible until the new data arrives (no flash of an empty screen). Changing
 * `deps` (for example new search filters) shows the loading state instead.
 */
export function useAsync<T>(loader: () => Promise<T>, deps: ReadonlyArray<unknown>): AsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [version, setVersion] = useState(0);
  const keepDataRef = useRef(false);

  const reload = useCallback(() => {
    keepDataRef.current = true;
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const keepData = keepDataRef.current;
    keepDataRef.current = false;
    setState((previous) => (keepData && previous.status === 'success' ? previous : { status: 'loading' }));
    loader().then(
      (data) => {
        if (!cancelled) setState({ status: 'success', data });
      },
      (error: unknown) => {
        if (!cancelled) {
          setState({ status: 'error', error: error instanceof Error ? error : new Error(String(error)) });
        }
      },
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  return { ...state, reload };
}
