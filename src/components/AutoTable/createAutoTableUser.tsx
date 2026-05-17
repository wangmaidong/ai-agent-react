import { AutoTableContext, type iAutoTable, type iAutoTableDefaultConfig, type iAutoTableUseConfig } from "./useAutoTable.utils.tsx";
import { useAppContext } from "../../AppService/useAppService.tsx";
import { useMounted } from "../../uses/useMounted.tsx";
import { useAutoTableConfig } from "./uses/useAutoTable.config.tsx";
import { useAutoTableState } from "./uses/useAutoTable.state.tsx";
import { useAutoTableContent } from "./uses/useAutoTable.content.tsx";
import { useAutoTableHandler } from "./uses/useAutoTable.handler.tsx";
import { useAutoTableFilterForm } from "./uses/useAutoTable.filterForm.tsx";
import { useAutoTableFilterSearch } from "./uses/useAutoTable.filterSearch.tsx";
import { useAutoTableFilterText } from "./uses/useAutoTable.filterText.tsx";
import { Space } from "antd";

export function createAutoTableUser(defaultConfig: iAutoTableDefaultConfig) {
  return (useConfig: iAutoTableUseConfig | (() => iAutoTableUseConfig)) => {

    const appService = useAppContext();


    let autoTable: iAutoTable = {
      useConfig,
      defaultConfig,
      appService,
    } as any;

    Object.assign(autoTable, useAutoTableConfig(autoTable));
    Object.assign(autoTable, useAutoTableState(autoTable));
    Object.assign(autoTable, useAutoTableHandler(autoTable));
    Object.assign(autoTable, useAutoTableFilterForm(autoTable));
    Object.assign(autoTable, useAutoTableFilterSearch(autoTable));
    Object.assign(autoTable, useAutoTableFilterText(autoTable));
    Object.assign(autoTable, useAutoTableContent(autoTable));

    /*---------------------------------------lifecycle-------------------------------------------*/

    useMounted(async () => {
      autoTable.runningConfig.loadOnStart && await autoTable.methods.reload();
    });

    autoTable.render = () => (
      <AutoTableContext.Provider value={autoTable}>
        <div className="auto-table">
          <Space vertical style={{ width: "100%" }}>
            {autoTable.hooks.bodyRender.render()}
          </Space>
        </div>
      </AutoTableContext.Provider>
    );

    return autoTable;
  };
}
