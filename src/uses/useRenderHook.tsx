import React, { useState } from "react";
import { useStableCallback } from "./useStableCallback.tsx";
import { insertSort } from "@peryl/utils/insertSort.ts";

export interface iRenderMeta {
  seq: number,
  key: string,
  content: React.ReactNode | (() => React.ReactNode),
}

export function useRenderHook() {

  // renderMetas 作用跟ref变量是一样的，是一个可变对象数组，但是对象引用永远不变
  // renderMetas在真正使用的时候，数组长度是不会变的，用作memo变量的依赖数组
  // (iRenderMeta | null)[] ✅️
  // iRenderMeta[] | null ❌️
  const [renderMetas] = useState([] as (iRenderMeta | null)[]);
  // 每次组件渲染的时候，renderMetas 都要清空，由其他Hook函数，往里边加元素
  renderMetas.splice(0, renderMetas.length);

  // 添加渲染内容
  const use = useStableCallback((itemMeta: iRenderMeta | null) => {
    renderMetas.push(itemMeta);
  });

  const render = () => {
    const metas = renderMetas.filter(i => i != null);
    return insertSort(metas, (a, b) => a.seq > b.seq).map(item => (
      <React.Fragment key={item.key}>
        {typeof item.content === "function" ? item.content() : item.content}
      </React.Fragment>
    ));
  };

  return {
    renderMetas,
    use, render,
  };
}
