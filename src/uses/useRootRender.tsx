import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

/**
 * 【全局命令式渲染容器钩子】
 * * * 核心作用：
 * 将原本需要“声明式”定义的 Modal、Drawer、Previewer 等组件，转化为可跨层级调用的“命令式服务”。
 * * * 解决痛点：
 * 1. 避免在每个页面手动引入 <Modal /> 和控制 visible 状态。
 * 2. 允许在非 React 组件环境（如纯 JS 函数、请求拦截器）中直接弹出 UI。
 * 3. 统一管理全局悬浮层，解决 z-index 层级冲突和 Context 丢失问题。
 * * * 使用场景：
 * - 封装 `ModalService.show({ content: <Form /> })`
 * - 封装 `DrawerService.open({ title: '详情', id: 123 })`
 * * * 架构原理：
 * 通过 `wrap` 方法在应用顶层注入 Context 和 渲染列表，各处通过 `setRootRenderList` 动态增删渲染项。
 */
export function useRootRenderService() {
  const [rootRenderList, setRootRenderList] = useState<iRenderList>([]);
  const rootRenderContextValue = useMemo(() => ({ setRootRenderList }), [setRootRenderList]);
  const wrap = useCallback(
    (content: any) => {
      return (
        <RootRenderContext.Provider value={rootRenderContextValue}>
          {content}
          {rootRenderList.map((item) => (
            <React.Fragment key={item.key}>{item.render}</React.Fragment>
          ))}
        </RootRenderContext.Provider>
      );
    },
    [rootRenderContextValue, rootRenderList]
  );
  return {
    wrap,
    setRootRenderList,
  };
}

export const RootRenderContext = React.createContext<{
  setRootRenderList: Dispatch<SetStateAction<iRenderList>>;
} | null>(null);

export type iRenderList = { key: string; render: ReactElement }[];

export const useRootRenderContext = () => {
  const context = React.useContext(RootRenderContext);
  if (!context) {
    throw new Error('useRootRenderContext must be used within a RootRenderProvider');
  }
  return context;
};
