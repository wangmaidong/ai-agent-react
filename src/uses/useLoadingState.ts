import { useCallback, useMemo, useState } from "react";
import { uuid } from "@peryl/utils/uuid";

/*
* 一个loading状态控制模块
* 调用loading函数会增加一个loading标识，要关闭这个loading标识，则需要调用closeLoading函数
* 当所有loading标识都关闭时，isLoading变量返回false
* 只要有一个loading标识未关闭，isLoading变量返回true
*/
export function useLoadingState() {

  const [ids, setIds] = useState([] as string[]);

  const loading = useCallback(() => {
    const newId = uuid();
    setIds(prevIds => [...prevIds, newId]);
    return () => {
      setIds(prevIds => {
        const index = prevIds.indexOf(newId);
        if (index > -1) {
          const ids = [...prevIds];
          ids.splice(index, 1);
          return ids;
        } else {
          return prevIds;
        }
      });
    };
  }, []);

  const isLoading = useMemo(() => ids.length > 0, [ids]);

  return { loading, isLoading };
}
