import { useCallback, useRef } from 'react';

/**
 * useStableCallback - 稳定回调 Hook
 *
 * 作用：
 * 1. 返回一个引用稳定的回调函数，避免因闭包捕获最新变量而导致的无限重渲染
 * 2. 确保回调函数始终引用最新的 props/state，同时保持函数引用的稳定性
 * 3. 适用于依赖项数组为空但需要访问最新状态的场景
 *
 * 使用场景：
 * - 作为子组件的 props 传递，避免不必要的重渲染
 * - 在 useEffect 中作为依赖项，防止循环触发
 * - 需要访问最新状态但不希望触发重新创建函数的场景
 *
 * @template FN - 泛型，表示回调函数的类型
 * @param fn - 需要稳定的回调函数，可以为 null 或 undefined
 * @returns 返回一个引用稳定的回调函数
 *
 * @example
 * // 基本用法
 * const handleClick = useStableCallback(() => {
 *   console.log(count); // 始终访问最新的 count 值
 * });
 *
 * @example
 * // 带参数的回调
 * const handleChange = useStableCallback((value: string) => {
 *   setValue(value);
 * });
 *
 * @example
 * // 作为子组件 props，避免子组件不必要的重渲染
 * <ChildComponent onAction={useStableCallback(() => doSomething())} />
 */
export function useStableCallback<FN extends (...args: any) => any>(fn: FN | null | undefined): FN {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const stableFn = useCallback(
    (...args: any[]) => fnRef.current?.(...args),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return stableFn as FN;
}
