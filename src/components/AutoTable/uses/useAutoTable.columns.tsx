import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useMemo } from "react";
import type { iAutoColumnIndex } from "../standard/index/col.index.tsx";
import type { iAutoColumnOperation } from "../standard/operation/col.operate.tsx";

export function useAutoTableColumn(autoTable: iAutoTable) {

  const { runningConfig, hooks: { columnConfigs } } = autoTable;

  /*---------------------------------------调用方传入的字段列-------------------------------------------*/
  columnConfigs.push(...runningConfig.columns);

  /*---------------------------------------增加一个自动撑开宽度的列-------------------------------------------*/
  columnConfigs.push(useMemo(() =>
    ({ seq: 99, type: "input", dataIndex: "__fit__", width: undefined, title: "", editable: false, standard: true }), []));

  /*---------------------------------------增加索引列-------------------------------------------*/
  const indexColumnConfig = useMemo((): iAutoColumnIndex | null =>
      !runningConfig.showIndexColumn ? null : ({ type: "index" })
    , [runningConfig.showIndexColumn]);
  columnConfigs.push(indexColumnConfig);

  /*---------------------------------------操作列-------------------------------------------*/
  const operateColumnConfig = useMemo((): iAutoColumnOperation | null => {
    if (
      runningConfig.showOperateColumn && (
        (runningConfig.showCreateButton && runningConfig.showCopyButton) ||
        runningConfig.showEditButton ||
        runningConfig.showDeleteButton
      )
    ) {
      return { seq: 100, type: "operation", fixed: "right" };
    } else {
      return null;
    }
  }, [runningConfig.showOperateColumn, runningConfig.showCreateButton, runningConfig.showCopyButton, runningConfig.showEditButton, runningConfig.showDeleteButton]);
  columnConfigs.push(operateColumnConfig);
}
