export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  if (limit <= 0) {
    throw new Error('Throttle limit must be positive');
  }

  let inThrottle = false;
  let timeoutId: NodeJS.Timeout | null = null;

  const throttled = function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        inThrottle = false;
        timeoutId = null;
      }, limit);
    }
  };

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    inThrottle = false;
  };

  return throttled as ((...args: Parameters<T>) => void) & {
    cancel: () => void;
  };
}
