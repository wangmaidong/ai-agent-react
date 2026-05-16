import type { iAutoTableDefaultConfig, iAutoTableRunningConfig, iAutoTableUseConfig } from "./useAutoTable.utils.tsx";
import { useCallback, useMemo, useState } from "react";
import type { PlainObject } from "@peryl/utils/event";
import { useAppContext } from "../../AppService/useAppService.tsx";
import type { BatisQueryBody, BatisQueryResponse } from "./batis.type.tsx";
import { showError } from "../../utils/showError.ts";
import { useMounted } from "../../uses/useMounted.tsx";
import { Table } from "antd";

export function createAutoTableUser(defaultConfig: iAutoTableDefaultConfig) {
  return (useConfig: iAutoTableUseConfig) => {

    const { http } = useAppContext();

    /*---------------------------------------config 模块-------------------------------------------*/

    const runningConfig = useMemo((): iAutoTableRunningConfig => {
      const defaultPageSize = useConfig.pageSize ?? defaultConfig.pageSize;
      return {
        loadOnStart: true,
        paginationPageSizeOptions: (Array.from(new Set([5, 10, 20, 50, 100, defaultPageSize])) as number[]).sort((a, b) => a - b),
        ...defaultConfig,
        ...useConfig,
      };
    }, [useConfig]);

    /*---------------------------------------state 模块-------------------------------------------*/

    const [data, setData] = useState([] as PlainObject[]);

    /*分页状态数据*/
    const [statePagination, setStatePagination] = useState(() => ({
      current: 1,
      pageSize: runningConfig.pageSize,
      total: 0,
    }));

    const load = useCallback(async (page: number, pageSize: number) => {
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
      }
    }, [runningConfig.module, http]);

    const reload = useCallback(() => load(0, statePagination.pageSize), [load, statePagination.pageSize]);

    useMounted(async () => {
      runningConfig.loadOnStart && reload();
    });

    const content = useMemo(() => (
      <div>
        <Table
          dataSource={data}
          pagination={{
            ...statePagination,
            showTotal: (total) => `共 ${total} 条数据`,
            showSizeChanger: true,
            pageSizeOptions: runningConfig.paginationPageSizeOptions,
            onChange: (page, pageSize) => load(page - 1, pageSize),
          }}
          columns={runningConfig.columns}
          rowKey="id"
        />
      </div>
    ), [
      data, runningConfig.columns, load,
      statePagination, runningConfig.paginationPageSizeOptions,
    ]);

    return {

      data, setData,
      content,

      load, reload,

    };
  };
}
