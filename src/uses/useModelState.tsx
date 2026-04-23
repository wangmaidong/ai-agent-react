import { useCallback, useEffect, useRef, useState } from "react";

export function useModelState<T>(propsValue: T, propsEmit?: (value: T) => void, config?: { onPropsValueChange?: (newPropsValue: T) => void }) {

  // 1. 使用状态保存内部值
  const [modelValue, setModelValue] = useState<T>(propsValue);

  // 2. 使用 Ref 保存最新的 config，避免 useEffect 依赖导致的不必要触发
  const configRef = useRef(config);
  configRef.current = config;

  // 3. 监听外部 props 变化 (受控逻辑)
  useEffect(() => {
    // 只有在 props 真的变化时才同步到内部状态
    if (propsValue !== modelValue) {
      setModelValue(propsValue);
      configRef.current?.onPropsValueChange?.(propsValue);
    }
    // 注意：这里通常只需要监听 propsValue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsValue]);

  // 4. 更新函数 (非受控逻辑)
  // 使用 useCallback 保证函数引用稳定，避免子组件不必要的重渲染
  const updateValue = useCallback((newValue: T) => {
    /*用来获取当前最新的modelValue值*/
    let prevValue = undefined as any;

    setModelValue((prev) => {
      prevValue = prev;
      /*拿到最新的值判断是否变化，不变的情况下返回原始值*/
      if (prev === newValue) return prev;

      // 在状态更新后触发外部回调
      // 放在 setModelValue 的回调里或之后执行均可
      return newValue;
    });

    // 只有在值确实变化时才 emit
    if (newValue !== prevValue) {
      propsEmit?.(newValue);
    }
  }, [propsEmit]);

  return [modelValue, updateValue] as const;
}