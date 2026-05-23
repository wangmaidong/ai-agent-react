import type { iAutoTable, iAutoTableConfigButton } from "../useAutoTable.utils.tsx";
import { useCallback, useMemo, useState } from "react";
import type { PlainObject } from "@peryl/utils/event";
import { getRowsMapper } from "../../AutoColumn/AutoColumn.utils.tsx";
import type { iAutoColumnCheck } from "../standard/check/col.check.tsx";
import { notification } from "antd";
import { useStableCallback } from "../../../uses/useStableCallback.tsx";
import { getNewestValue } from "../../../uses/getNewestValue.ts";

export function useAutoTableMultiSelect(autoTable: iAutoTable) {

  const {
    state: { data, stateCreateIdMapper, setData },
    runningConfig: { showCheckColumn, checkRowOnClick },
    hooks: {
      columnConfigs,
      buttonConfigs,
      onClickRow, onAfterLoad, onAfterInsert, onAfterUpdate, onAfterDelete,
    },
  } = autoTable;

  /*选中的行数据*/
  const [checkedRows, setCheckedRows] = useState([] as PlainObject[]);

  /*根据id判断行数据是否已经选中*/
  const checkIdMap = useMemo(() => getRowsMapper(checkedRows, { key: "id", value: () => true }), [checkedRows]);

  /*根据id判断行数据是否已经选中*/
  const isChecked = useCallback((row: PlainObject) => !!checkIdMap[row.id], [checkIdMap]);

  /*
  * checkStatus 计算当前页的选中状态
  * check: 当前页所有数据已经被选中
  * uncheck：当前页所有数据没有被选中
  * half：当前页部分数据被选中
  */

  /*方案一：按照当前页数据来计算选中状态，其他页选中数据不参与计算*/
  const checkStatus = useMemo((): "check" | "uncheck" | "half" => {
    if (!data.length) {
      return "uncheck";
    }
    let hasChecked = null as null | boolean;
    let hasUnChecked = null as null | boolean;
    for (const item of data) {
      if (isChecked(item)) {
        hasChecked = true;
      } else {
        hasUnChecked = true;
      }
    }
    if (hasChecked && hasUnChecked == null) {
      return "check";
    }
    if (hasChecked == null && hasUnChecked) {
      return "uncheck";
    }
    return "half";
  }, [data, isChecked]);

  /*方案二：按照所有页选中数据来计算选中状态，只要出现跨页选中数据就显示为半选状态，只有选中当前页数据并且全部选中才会显示为全选状态*/
  // const checkStatus = useMemo((): 'check' | 'uncheck' | 'half' => {
  //   if (!stateCheckedRows.length) {
  //     return 'uncheck';
  //   }
  //   if (stateCheckedRows.length === stateData.length && stateData.every(i => isChecked(i))) {
  //     return 'check';
  //   }
  //   return 'half';
  // }, [stateData, isChecked, stateCheckedRows]);

  /*全选/取消全选*/
  const toggleCheckAll = useCallback(() => {
    if (checkStatus !== "check") {
      /*全选当前页数据*/
      const uncheckRows = data.filter(i => !isChecked(i));
      setCheckedRows(prevRows => [...prevRows, ...uncheckRows]);
    } else {
      /*取消选中当前页数据*/
      const id2stateRow = getRowsMapper(data, { key: "id", value: () => true });
      const leftCheckRows = checkedRows.filter(i => !id2stateRow[i.id]);
      setCheckedRows(leftCheckRows);
    }
  }, [data, isChecked, checkStatus, checkedRows]);

  /*选中行/取消选中行*/
  const toggleCheckRow = useCallback((record: PlainObject) => {

    if (stateCreateIdMapper[record.id]) {
      /*新建的数据不可以被选中*/
      return;
    }

    setCheckedRows(prevCheckedRows => {
      prevCheckedRows = [...prevCheckedRows];
      const matchRowIndex = prevCheckedRows.findIndex(i => i.id === record.id);
      if (matchRowIndex > -1) {
        prevCheckedRows.splice(matchRowIndex, 1);
      } else {
        prevCheckedRows.push(record);
      }
      return prevCheckedRows;
    });
  }, [stateCreateIdMapper]);

  const checkColumnConfig = useMemo((): iAutoColumnCheck | null => {
    if (!showCheckColumn) {return null;}
    return { type: "check" };
  }, [showCheckColumn]);

  columnConfigs.push(checkColumnConfig);

  onClickRow.use(
    useCallback(({ record }) => {
      checkRowOnClick && toggleCheckRow(record);
    }, [checkRowOnClick, toggleCheckRow]),
  );

  /*根据data中的行数据，更新选中的缓存数据*/
  const refreshRowsByData = useStableCallback(async () => {
    const newestData = await getNewestValue(setData);
    const stateDataMap = getRowsMapper(newestData, { key: "id", value: item => item });
    setCheckedRows(prevCheckedRows => prevCheckedRows.map(item => stateDataMap[item.id] || item));
  });

  /*查询、新建、更新数据之后，要刷新选中缓存的数据*/
  onAfterLoad.use(refreshRowsByData);
  onAfterInsert.use(refreshRowsByData);
  onAfterUpdate.use(refreshRowsByData);

  /*删除数据之后，要删除选中缓存中的数据*/
  onAfterDelete.use(useCallback(async ({ record }) => {
    setCheckedRows(prevCheckedRows => prevCheckedRows.filter(i => i.id !== record.id));
  }, []));

  /*一个测试的按钮，用来展示选中的数据*/
  buttonConfigs.push(useMemo((): iAutoTableConfigButton | null => !showCheckColumn ? null : ({
    key: "showMultiSelectRows",
    label: "获取多选行",
    onClick: () => {
      const val = checkedRows.map(i => i.fullName).join(", ") || "无选中数据";
      console.log({ val }, checkedRows);
      notification.info({ description: val });
    },
  }), [showCheckColumn, checkedRows]));

  return {
    multiSelect: {
      checkedRows,
      checkStatus,
      toggleCheckAll,
      toggleCheckRow,
      isChecked,
    },
  };
}

export type iAutoTableMultiSelect = ReturnType<typeof useAutoTableMultiSelect>["multiSelect"]

declare module "../useAutoTable.utils.tsx" {
  interface iAutoTable {
    multiSelect: iAutoTableMultiSelect;
  }
}
