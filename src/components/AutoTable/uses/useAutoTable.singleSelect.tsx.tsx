import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PlainObject } from "@peryl/utils/event";
import { useStableCallback } from "../../../uses/useStableCallback.tsx";
import { getNewestValue } from "../../../uses/getNewestValue.ts";
import { delay } from "@peryl/utils/delay";

/*
* 通用表格单选模块，通过索引列展示单选状态
*/
export function useAutoTableSingleSelect(autoTable: iAutoTable) {

  const {
    state: { data, setData },
    hooks: { onClickRow, onAfterLoad, onSelectRowChange },
    runningConfig: { selectRowOnClick, selectRowOnLoad },
  } = autoTable;

  /*选中的行数据id*/
  const [singleSelectId, setSingleSelectId] = useState(null as null | string);

  /*选中的行数据对象*/
  const singleSelectRecord = useMemo((): PlainObject | undefined =>
    !singleSelectId ? undefined : data.find(i => i.id === singleSelectId), [data, singleSelectId]);

  /*选中某一行数据*/
  const selectRow = useStableCallback((rowOrId: string | PlainObject) => {
    setSingleSelectId(typeof rowOrId === "string" ? rowOrId : rowOrId.id);
  });

  /*点击行的时候选中该行*/
  onClickRow.use(
    useCallback(({ record }) => {
      if (!selectRowOnClick) {return;}
      setSingleSelectId(record.id);
    }, [selectRowOnClick]),
  );

  /*数据加载完毕之后自动选中第一行*/
  onAfterLoad.use(
    useStableCallback(async () => {
      if (!selectRowOnLoad) {return;}
      const newestData = await getNewestValue(setData);
      setSingleSelectId(newestData[0]?.id);
    }),
  );

  // 保存上一次选中的行数据
  const prevSelectRecordRef = useRef(null as null | PlainObject);

  // 2. 接收当前最新的 record 作为参数，不再依赖 ref.current 慢半拍的问题
  const emitSelectRowChange = useStableCallback(async (currentRecord: PlainObject | null) => {
    // 这里下一次出事件循环，不然会有异常的bug，onSelectRowChange.handlersRef.current拿不到正常的值
    await delay(0);
    const prevRecord = prevSelectRecordRef.current;
    // 数据没变，直接拦截
    if (isRecordEqual(currentRecord, prevRecord)) return;
    // 变了，更新记录并触发事件
    prevSelectRecordRef.current = currentRecord;
    await onSelectRowChange.exec({ record: currentRecord });
  });

  // 3. 完美的依赖：数据对象变了就执行，并把最新的数据直接送进去
  useEffect(() => {
    emitSelectRowChange(singleSelectRecord || null);
  }, [singleSelectRecord, emitSelectRowChange]);

  return {
    singleSelect: {
      singleSelectId,
      singleSelectRecord,
      selectRow,
      setSingleSelectId,
    },
  };
}

export type iAutoTableSingleSelect = ReturnType<typeof useAutoTableSingleSelect>["singleSelect"]

declare module "../useAutoTable.utils.tsx" {
  interface iAutoTable {
    singleSelect: iAutoTableSingleSelect;
  }
}

// 1. 抽离一个简单的浅比较工具
const isRecordEqual = (a: PlainObject | null, b: PlainObject | null) => {
  if (a === b) return true;
  if (!a || !b) return false;
  // 比较两者的字段是否一致
  return Object.keys({ ...a, ...b }).every(key => a[key] === b[key]);
};
