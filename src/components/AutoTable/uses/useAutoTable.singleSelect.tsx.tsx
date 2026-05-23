import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useCallback, useMemo, useState } from "react";
import type { PlainObject } from "@peryl/utils/event";
import { useStableCallback } from "../../../uses/useStableCallback.tsx";
import { getNewestValue } from "../../../uses/getNewestValue.ts";

/*
* 通用表格单选模块，通过索引列展示单选状态
*/
export function useAutoTableSingleSelect(autoTable: iAutoTable) {

  const {
    state: { data, setData },
    hooks: { onClickRow, onAfterLoad },
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

  return {
    singleSelect: { singleSelectId, singleSelectRecord, selectRow },
  };
}

export type iAutoTableSingleSelect = ReturnType<typeof useAutoTableSingleSelect>["singleSelect"]

declare module "../useAutoTable.utils.tsx" {
  interface iAutoTable {
    singleSelect: iAutoTableSingleSelect;
  }
}
