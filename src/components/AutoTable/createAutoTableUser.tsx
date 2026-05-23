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
import { useAutoTableColumn } from "./uses/useAutoTable.columns.tsx";
import { useAutoTableSingleSelect } from "./uses/useAutoTable.singleSelect.tsx.tsx";
import { useAutoTableMultiSelect } from "./uses/useAutoTable.multiSelect.tsx";

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

    autoTable.hooks.onBeforeLoad.use(
      useCallback(() => {
        if (autoTable.state.isTableEditing) {
          throw new Error("请先保存表格数据，再查询。");
        }
      }, [autoTable.state.isTableEditing]),
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
GlobalAutoTableModuleRegistration.addModule(8, "columns", useAutoTableColumn);
GlobalAutoTableModuleRegistration.addModule(9, "singleSelect", useAutoTableSingleSelect);
GlobalAutoTableModuleRegistration.addModule(10, "multipleSelect", useAutoTableMultiSelect);

/*
* 1. 在state模块中，将 runningConfig.columns 加到了 columnConfigs 中
* 2. 在content模块中，用 useMemo 计算 columns（要让 columnConfigs 的计算尽量晚执行，抽离成子组件来计算这个useMemo）
* 3. 在standardColumns模块中，对 columnConfigs 添加字段
*/
