import { throttle } from './throttle';

jest.useFakeTimers();

describe('throttle', () => {
  it('should call the function immediately on the first call', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should not call the function again before the limit', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    throttledFunc();
    jest.advanceTimersByTime(500);
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the function again after the limit has passed', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    jest.advanceTimersByTime(1000);
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should throw an error if the limit is not positive', () => {
    const func = jest.fn();

    expect(() => throttle(func, 0)).toThrow('Throttle limit must be positive');
    expect(() => throttle(func, -100)).toThrow(
      'Throttle limit must be positive',
    );
  });

  it('should cancel the throttling when cancel is called', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    throttledFunc.cancel();
    jest.advanceTimersByTime(1000);
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(2);
  });

  it('should handle the context (this) correctly', () => {
    const obj = {
      value: 42,
      func: jest.fn(function () {
        return this.value;
      }),
    };

    const throttledFunc = throttle(obj.func, 1000);

    throttledFunc.call(obj);
    expect(obj.func).toHaveBeenCalledWith();
    expect(obj.func.mock.results[0].value).toBe(42);
  });
});
