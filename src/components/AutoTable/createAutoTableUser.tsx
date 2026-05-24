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
import { useCallback, useMemo } from "react";
import { useAutoTableColumn } from "./uses/useAutoTable.columns.tsx";
import { useAutoTableSingleSelect } from "./uses/useAutoTable.singleSelect.tsx.tsx";
import { useAutoTableMultiSelect } from "./uses/useAutoTable.multiSelect.tsx";
import type { iAutoColumn } from "../AutoColumn/AutoColumn.utils.tsx";
import { insertSort } from "@peryl/utils/insertSort.ts";
import { CreateDefaultColumnConfig, fillWithDefaultColumn } from "../AutoColumn/CreateDefaultColumnConfig.tsx";
import { useAutoTableFormService } from "./uses/useAutoTable.formService.tsx";
import { useAutoTableVibeCreate } from "./uses/useAutoTable.vibeCreate.tsx";

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

    /*在所有模块安装完毕之后，立即计算最后这个列信息*/
    const { columnConfigs } = autoTable.hooks;
    autoTable.state.renderColumnsRef.current = useMemo(() => {
        const notNullColumnConfigs: iAutoColumn[] = columnConfigs.filter(i => i != null);
        /*填充默认值*/
        const formattedColumns = notNullColumnConfigs.map((itemCol) => {
          if ("type" in itemCol && itemCol.type in CreateDefaultColumnConfig) {
            return fillWithDefaultColumn(itemCol);
          } else {
            /*没有type，当做Table普通的列处理*/
            return itemCol;
          }
        });
        /*按照seq排序*/
        return insertSort(formattedColumns,
          (a, b) => {
            // 默认seq=0
            let aSeq = a.seq ?? 0;
            if (a.fixed === "left") {aSeq -= 100;}
            if (a.fixed === "right") {aSeq += 100;}
            let bSeq = b.seq ?? 0;
            if (b.fixed === "left") {bSeq -= 100;}
            if (b.fixed === "right") {bSeq += 100;}
            return aSeq > bSeq;
          });
      },
      // eslint-disable-next-line
      [columnConfigs, ...columnConfigs],
    );
    console.log(autoTable.state.renderColumnsRef.current);

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
GlobalAutoTableModuleRegistration.addModule(11, "formService", useAutoTableFormService);
GlobalAutoTableModuleRegistration.addModule(12, "vibeCreate", useAutoTableVibeCreate);

/*
* 1. 在state模块中，将 runningConfig.columns 加到了 columnConfigs 中
* 2. 在content模块中，用 useMemo 计算 columns（要让 columnConfigs 的计算尽量晚执行，抽离成子组件来计算这个useMemo）
* 3. 在standardColumns模块中，对 columnConfigs 添加字段
*/
