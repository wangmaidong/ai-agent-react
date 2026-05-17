import { AutoTableContext, type iAutoTableDefaultConfig, type iAutoTableRunningConfig, type iAutoTableUseConfig } from "./useAutoTable.utils.tsx";
import { useCallback, useMemo, useState } from "react";
import type { PlainObject } from "@peryl/utils/event";
import { useAppContext } from "../../AppService/useAppService.tsx";
import type { BatisQueryBody, BatisQueryResponse } from "./batis.type.tsx";
import { showError } from "../../utils/showError.ts";
import { useMounted } from "../../uses/useMounted.tsx";
import { type FormInstance, Table } from "antd";
import { useLoadingState } from "../../uses/useLoadingState.ts";
import { CreateDefaultColumnConfig } from "../AutoColumn/CreateDefaultColumnConfig.tsx";
import { AutoTableCell } from "./components/AutoTableCell.tsx";

export function createAutoTableUser(defaultConfig: iAutoTableDefaultConfig) {
  return (useConfig: iAutoTableUseConfig | (() => iAutoTableUseConfig)) => {

    const { http } = useAppContext();
    console.warn(http);

    /*---------------------------------------config 模块-------------------------------------------*/

    const [stateConfig, setStateConfig] = useState(useConfig);

    const runningConfig = useMemo((): iAutoTableRunningConfig => {
      const defaultPageSize = stateConfig.pageSize ?? defaultConfig.pageSize;
      return {
        loadOnStart: true,
        paginationPageSizeOptions: (Array.from(new Set([5, 10, 20, 50, 100, defaultPageSize])) as number[]).sort((a, b) => a - b),
        ...defaultConfig,
        ...stateConfig,
      };
    }, [stateConfig]);

    /*---------------------------------------state 模块-------------------------------------------*/

    const [data, setData] = useState([] as PlainObject[]);

    /*分页状态数据*/
    const [statePagination, setStatePagination] = useState(() => ({
      current: 1,
      pageSize: runningConfig.pageSize,
      total: 0,
    }));

    /*标记哪些id的row被开启了编辑状态*/
    const [stateUpdateIdMapper, setStateUpdateIdMapper] = useState({} as Record<string, boolean | undefined>);

    /*标记哪些id的row是新建的行编辑状态*/
    const [stateCreateIdMapper, setStateCreateIdMapper] = useState({} as Record<string, boolean | undefined>);

    /*哪些row的id应该开启编辑状态，新建以及编辑的行都应该开启编辑状态*/
    const editIdMapper = useMemo(() => ({ ...stateUpdateIdMapper, ...stateCreateIdMapper }), [stateUpdateIdMapper, stateCreateIdMapper]);

    /*用来通过record找到FormInstance的一个管理器*/
    const [formInstanceManager] = useState(() => new WeakMap<PlainObject, FormInstance>());

    const { loading, isLoading } = useLoadingState();

    const load = useCallback(async (page: number, pageSize: number) => {
      const closeLoading = loading();
      try {
        const resp = await http.post<BatisQueryResponse>(`/general/${runningConfig.module}/list`, {
          page: page,
          pageSize: pageSize,
          withCount: true,
        } satisfies BatisQueryBody);
        setData(resp.data.list ?? []);
        setStatePagination({ pageSize, current: page + 1, total: resp.data.total ?? resp.data.list?.length ?? 0 });
      } catch (e) {
        showError(e);
      } finally {
        closeLoading();
      }
    }, [runningConfig.module, http, loading]);

    const reload = useCallback(() => load(0, statePagination.pageSize), [load, statePagination.pageSize]);

    /*---------------------------------------handler-------------------------------------------*/

    /*---------------------------------------methods-------------------------------------------*/

    const editRecord = useCallback((record: PlainObject) => {}, []);

    const deleteRecord = useCallback((record: PlainObject) => {}, []);

    const saveRecord = useCallback((record: PlainObject) => {}, []);

    const cancelEditRecord = useCallback((record: PlainObject) => {}, []);

    /*---------------------------------------lifecycle-------------------------------------------*/

    useMounted(async () => {
      runningConfig.loadOnStart && reload();
    });

    const tablePropsColumns = useMemo(() => {
      const columns = [...runningConfig.columns];
      columns.push({ type: "operation" });
      return columns.map(col => {
        col = {
          ...CreateDefaultColumnConfig[col.type](col as any),
          ...col,
        };
        return {
          render: (value: any, record: PlainObject, index: number) => (
            <AutoTableCell
              value={value}
              record={record}
              index={index}
              col={col}
            />
          ),
          ...col,
        };
      });
    }, [runningConfig.columns]);

    const render = useCallback(() => null as any, []);

    const autoTable = useMemo(() => ({
      stateConfig, setStateConfig,
      runningConfig,

      data, setData,
      stateUpdateIdMapper, setStateUpdateIdMapper,
      stateCreateIdMapper, setStateCreateIdMapper,
      editIdMapper,
      formInstanceManager,
      isLoading,

      load, reload,
      editRecord,
      deleteRecord,
      saveRecord,
      cancelEditRecord,

      render,
    }), [
      stateConfig, setStateConfig,
      runningConfig,

      data, setData,
      stateUpdateIdMapper, setStateUpdateIdMapper,
      stateCreateIdMapper, setStateCreateIdMapper,
      editIdMapper,
      formInstanceManager,
      isLoading,

      load, reload,
      editRecord,
      deleteRecord,
      saveRecord,
      cancelEditRecord,

      render,
    ]);

    autoTable.render = () => (
      <AutoTableContext.Provider value={autoTable}>
        <div>
          <Table
            dataSource={data}
            loading={isLoading}
            pagination={{
              ...statePagination,
              showTotal: (total) => `共 ${total} 条数据`,
              showSizeChanger: true,
              pageSizeOptions: runningConfig.paginationPageSizeOptions,
              onChange: (page, pageSize) => load(page - 1, pageSize),
            }}
            columns={tablePropsColumns}
            rowKey="id"
          />
        </div>
      </AutoTableContext.Provider>
    );

    return autoTable;
  };
}

export type iAutoTableUser = ReturnType<typeof createAutoTableUser>
export type iAutoTable = ReturnType<iAutoTableUser>
