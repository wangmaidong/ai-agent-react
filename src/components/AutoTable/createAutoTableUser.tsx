import type { iAutoTableDefaultConfig, iAutoTableRunningConfig, iAutoTableUseConfig } from "./useAutoTable.utils.tsx";
import { useCallback, useMemo, useState } from "react";
import type { PlainObject } from "@peryl/utils/event";
import { useAppContext } from "../../AppService/useAppService.tsx";
import type { BatisQueryResponse } from "./batis.type.tsx";
import { showError } from "../../utils/showError.ts";
import { useMounted } from "../../uses/useMounted.tsx";
import { Table } from "antd";

export function createAutoTableUser(defaultConfig: iAutoTableDefaultConfig) {
  return (useConfig: iAutoTableUseConfig) => {

    const { http } = useAppContext();

    /*---------------------------------------config 模块-------------------------------------------*/

    const runningConfig = useMemo((): iAutoTableRunningConfig => {
      return {
        ...defaultConfig,
        ...useConfig,
      };
    }, [useConfig]);

    /*---------------------------------------state 模块-------------------------------------------*/

    const [data, setData] = useState([] as PlainObject[]);

    const load = useCallback(async () => {
      try {
        const resp = await http.post<BatisQueryResponse>(`/general/${runningConfig.module}/list`, {
          page: 0,
          pageSize: runningConfig.pageSize,
        });
        setData(resp.data.list ?? []);
      } catch (e) {
        showError(e);
      }
    }, [runningConfig.module, runningConfig.pageSize, http]);

    const reload = useCallback(() => load(), [load]);

    useMounted(async () => {
      reload();
    });

    const content = useMemo(() => (
      <div>
        <Table
          dataSource={data}
          columns={runningConfig.columns}
          rowKey="id"
        />
      </div>
    ), [data, runningConfig.columns]);

    return {

      data, setData,
      content,

      load, reload,

    };
  };
}
