/**
 * Prototype-only helper. Every service function returns a Promise, exactly like a
 * real backend call would, so pages already handle loading and error states.
 * DELETE this file's usage when the services are connected to a real backend.
 *
 * To see the error state in the browser, add "?simulateError=1" to any URL.
 */
const LATENCY_MS = 350;

function shouldSimulateError(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('simulateError') === '1';
}

export function simulateNetwork<T>(value: T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (shouldSimulateError()) {
        reject(new Error('Simulated network error (prototype)'));
      } else {
        resolve(value);
      }
    }, LATENCY_MS);
  });
}
