import { type iAutoTable, type iAutoTableDefaultConfig, type iAutoTableUseConfig } from "./useAutoTable.utils.tsx";
import { useAppContext } from "../../AppService/useAppService.tsx";
import { useMounted } from "../../uses/useMounted.tsx";
import { useAutoTableConfig } from "./uses/useAutoTable.config.tsx";
import { useAutoTableState } from "./uses/useAutoTable.state.tsx";
import { useAutoTableContent } from "./uses/useAutoTable.content.tsx";
import { useAutoTableHandler } from "./uses/useAutoTable.handler.tsx";

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
    Object.assign(autoTable, useAutoTableContent(autoTable));
    Object.assign(autoTable, useAutoTableHandler(autoTable));

    /*---------------------------------------lifecycle-------------------------------------------*/

    useMounted(async () => {
      autoTable.runningConfig.loadOnStart && await autoTable.methods.reload();
    });

    return autoTable;
  };
}
