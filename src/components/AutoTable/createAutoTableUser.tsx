import { AutoTableContext, createAutoTableModuleRegistration, GlobalAutoTableModuleRegistration, type iAutoTable, type iAutoTableDefaultConfig, type iAutoTableUseConfig } from "./useAutoTable.utils.tsx";
import { useAppContext } from "../../AppService/useAppService.tsx";
import { useMounted } from "../../uses/useMounted.tsx";
import { useAutoTableConfig } from "./uses/useAutoTable.config.tsx";
import { useAutoTableState } from "./uses/useAutoTable.state.tsx";
import { useAutoTableContent } from "./uses/useAutoTable.content.tsx";
import { useAutoTableFilterForm } from "./uses/useAutoTable.filterForm.tsx";
import { useAutoTableFilterSearch } from "./uses/useAutoTable.filterSearch.tsx";
import { useAutoTableFilterText } from "./uses/useAutoTable.filterText.tsx";
import { Space } from "antd";
import "./auto-table.scss";
import { useAutoTableButtons } from "./uses/useAutoTable.buttons.tsx";
import { useCallback } from "react";

export function createAutoTableUser(defaultConfig: iAutoTableDefaultConfig) {

  /*局部的模块注册器*/
  const localAutoTableModuleRegistration = createAutoTableModuleRegistration();

  const useAutoTable = (useConfig: iAutoTableUseConfig | (() => iAutoTableUseConfig)) => {

    const appService = useAppContext();


    let autoTable: iAutoTable = {
      useConfig,
      defaultConfig,
      appService,
    } as any;

    localAutoTableModuleRegistration.useModule({
      autoTable,
      prevMapper: GlobalAutoTableModuleRegistration.moduleMapper,
    });

    /*---------------------------------------lifecycle-------------------------------------------*/
    const {
      hooks: { onDoubleClickRow },
      runningConfig: { editRowOnDblClick },
      methods: { editRecord },
    } = autoTable;

    useMounted(async () => {
      autoTable.runningConfig.loadOnStart && await autoTable.methods.reload();
    });

    autoTable.hooks.onDoubleClickRow.use(
      useCallback(async ({ record }) => {
        if (editRowOnDblClick) {
          await editRecord(record);
        }
      }, [editRowOnDblClick, editRecord]),
    );

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

  return Object.assign(useAutoTable, localAutoTableModuleRegistration);

}

GlobalAutoTableModuleRegistration.addModule(1, "config", useAutoTableConfig);
GlobalAutoTableModuleRegistration.addModule(2, "state", useAutoTableState);
GlobalAutoTableModuleRegistration.addModule(3, "filterForm", useAutoTableFilterForm);
GlobalAutoTableModuleRegistration.addModule(4, "filterSearch", useAutoTableFilterSearch);
GlobalAutoTableModuleRegistration.addModule(5, "filterText", useAutoTableFilterText);
GlobalAutoTableModuleRegistration.addModule(6, "content", useAutoTableContent);
GlobalAutoTableModuleRegistration.addModule(7, "buttons", useAutoTableButtons);
