import React, { useContext } from "react";
import type { PlainObject } from "@peryl/utils/event";
import type { TableProps } from "antd/es/table/InternalTable";
import type { iAutoColumn } from "../AutoColumn/AutoColumn.utils.tsx";
import type { FormInstance } from "antd";
import type { iAppService } from "../../AppService/useAppService.tsx";
import { insertSort } from "@peryl/utils/insertSort.ts";

/*---------------------------------------type-------------------------------------------*/

// AutoTable默认设置的配置参数类型
export interface iAutoTableDefaultConfig {
  pageSize: number,                   /*页大小*/
  loadOnStart?: boolean,              /*自动初始化数据*/
  selectRowOnClick?: boolean,         /*点击行的时候就选中数据（单选）*/
  selectRowOnLoad?: boolean,          /*查询完毕的时候选中数据（单选）*/
  checkRowOnClick?: boolean,          /*点击行的时候选中数据（多选）*/
  showEditButton?: boolean,           /*显示编辑按钮*/
  showDeleteButton?: boolean,         /*显示删除按钮*/
  showCreateButton?: boolean,         /*显示新建按钮*/
  showCopyButton?: boolean,           /*显示复制按钮*/
  showOperateColumn?: boolean,        /*显示操作列*/
  editRowOnDblClick?: boolean,        /*双击行的时候开启编辑状态*/
  showSearchBar?: boolean,            /*显示搜索栏*/
  showButtonBar?: boolean,            /*显示按钮栏*/
  paginationPageSizeOptions?: number[],/*页码大小选项*/
  tableProps?: TableProps<PlainObject>,/*传递给Table组件的属性*/
}

// 调用useAutoTable时才能确定传入的参数类型
export interface iAutoTableInputConfig {
  module: string,                                             /*对应后端通用模块地址*/
  columns: iAutoColumn[],                                     /*字段信息*/
  // columns: iAutoColumnType[],                              /*字段信息*/
  selectType?: "single" | "multiple",                         /*选择列类型：single单选，multiple多选*/
  operations?: iAutoTableConfigOperations,                    /*自定义渲染操作栏内容*/
  defaultNewRow?: iAutoTableConfigDefaultNewRow,              /*默认新建行数据*/
  defaultNewRowId?: boolean,                                  /*新建的行数据是否需要自动获取一个id*/
  buttons?: iAutoTableConfigButtons,                          /*自定义按钮*/
  sortField?: string,                                         /*默认排序字段*/
  sortDesc?: boolean,                                         /*默认排序方式*/
  searchField?: string,                                       /*默认搜索字段*/
  // parentTable?: iAutoTable,                                /*父表autoTable*/
  // parentKeyMap?: Record<string, string>,                   /*父表字段映射*/
  queryParam?: PlainObject | (() => Promise<PlainObject>),    /*查询参数*/
  createButtonText?: string,                                  /*新建按钮文本内容*/
  handleCreate?: () => void | Promise<void>,                  /*自定义处理新建按钮点击处理逻辑*/
}

/*类型太长的可以定义到下面这里*/
export type iAutoTableConfigOperations = (record: PlainObject, index: number) => React.ReactNode
export type iAutoTableConfigDefaultNewRow = PlainObject | (() => PlainObject | Promise<PlainObject>)
export type iAutoTableConfigButtons = { label?: string, onClick?: () => void, render?: () => React.ReactElement }[]


export type iAutoTableUseConfig = iAutoTableInputConfig & Partial<iAutoTableDefaultConfig>   // useAutoTable配置参数类型
export type iAutoTableRunningConfig = iAutoTableInputConfig & iAutoTableDefaultConfig        //  AutoTable内部运行时的配置参数类型

export interface iAutoTable {
  defaultConfig: iAutoTableDefaultConfig,
  useConfig: iAutoTableUseConfig | (() => iAutoTableUseConfig),
  appService: iAppService,
  render: () => React.ReactNode,
}

// 是AutoTable向所有子孙组件透传的上下文
export const AutoTableContext = React.createContext<iAutoTable | null>(null);

export function useAutoTableContext(): iAutoTable {
  const val = useContext(AutoTableContext);
  if (!val) {throw new Error("useAutoTableContext must be used within a AutoTableProvider");}
  return val;
}

export interface iAutoTableRowProvideContextValue {
  editable: boolean,
  form: FormInstance,
  formData: PlainObject
}

/*行组件，要透传给单元格组件的上下文*/
export const AutoTableRowContext = React.createContext<iAutoTableRowProvideContextValue | null>(null);

export const useAutoTableRowContext = (): iAutoTableRowProvideContextValue => {
  const val = useContext(AutoTableRowContext);
  if (!val) {throw new Error("useAutoTableRowContext must be used within a AutoTableRowProvider");}
  return val;
};

export interface iAutoTableModuleMeta {
  seq: number,
  key: string,
  hookFunc: (autoTable: iAutoTable) => any
}

export type iAutoTableModuleMapper = Record<string, iAutoTableModuleMeta | null | undefined>

export function createAutoTableModuleRegistration() {

  const moduleMapper: iAutoTableModuleMapper = {};

  /*添加模块*/
  const addModule = (seq: number, key: string, hookFunc: iAutoTableModuleMeta["hookFunc"]) => {
    moduleMapper[key] = { seq, key, hookFunc };
  };

  /*给autoTable对象安装模块*/
  const useModule = (
    {
      autoTable,
      prevMapper,
      nextMapper,
    }: {
      autoTable: iAutoTable,
      prevMapper?: iAutoTableModuleMapper, /*默认的模块*/
      nextMapper?: iAutoTableModuleMapper, /*覆盖的模块*/
      // moduleMapper 是内部的模块
    },
  ) => {
    let modules = Object.values({
      ...prevMapper,
      ...moduleMapper,
      ...nextMapper,
    }).filter(i => i != null);
    modules = insertSort(modules, (a, b) => a.seq > b.seq);
    modules.forEach(item => {
      Object.assign(autoTable, item.hookFunc(autoTable));
    });
  };

  return {
    addModule,
    useModule,
    moduleMapper,
  };
}

/*全局的AutoTable模块注册器*/
export const GlobalAutoTableModuleRegistration = createAutoTableModuleRegistration();
