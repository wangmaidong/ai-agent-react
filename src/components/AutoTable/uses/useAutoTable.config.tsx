import React, { useMemo, useState } from "react";
import type { iAutoTable, iAutoTableRunningConfig, iAutoTableUseConfig } from "../useAutoTable.utils.tsx";

export function useAutoTableConfig(autoTable: iAutoTable) {

  const { useConfig, defaultConfig } = autoTable;

  /*---------------------------------------config 模块-------------------------------------------*/

  const [stateConfig, setStateConfig] = useState(useConfig);

  const runningConfig = useMemo((): iAutoTableRunningConfig => {
    const defaultPageSize = stateConfig.pageSize ?? defaultConfig.pageSize;
    return {
      loadOnStart: true,
      selectRowOnClick: true,
      selectRowOnLoad: true,
      checkRowOnClick: true,

      showEditButton: true,
      showDeleteButton: true,
      showCreateButton: true,
      showCopyButton: true,
      showOperateColumn: true,
      editRowOnDblClick: true,
      showSearchBar: true,
      showButtonBar: true,
      showIndexColumn: true,
      showFilterForm: true,
      autoFormGridCols: 1,

      paginationPageSizeOptions: (Array.from(new Set([5, 10, 20, 50, 100, defaultPageSize])) as number[]).sort((a, b) => a - b),
      ...defaultConfig,
      ...stateConfig,
    };
  }, [stateConfig, defaultConfig]);

  return {
    stateConfig,
    setStateConfig,
    runningConfig,
  };
}

declare module "../useAutoTable.utils.tsx" {
  export interface iAutoTable {
    runningConfig: iAutoTableRunningConfig,
    stateConfig: iAutoTableUseConfig,
    setStateConfig: React.Dispatch<React.SetStateAction<iAutoTableUseConfig>>,
  }
}
