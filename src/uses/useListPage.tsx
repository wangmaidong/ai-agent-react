import { useStableCallback } from "./useStableCallback";
import { showError } from "../utils/showError";
import { useAppContext } from "../AppService/useAppService";
import { useState } from "react";
import { useMounted } from "./useMounted";
import { router } from "../layouts/routes";
import { iBaseRecord } from "../utils/type.utils";
import dayjs from "dayjs";
import { message, notification } from "antd";

export function useListPage<T extends iBaseRecord>(
  config: {
    module: string,                               // 模块名
    onAfterReload?: (recordList: T[]) => void,    // 处理加载完数据之后的动作
    autoReload?: boolean,                         // 是否自动在mounted阶段加载数据
    detailPath?: string,                          // 新建编辑数据页面的路径
    reloadAfterChange?: boolean,                  // 在删除/复制数据之后自动刷新数据
  },
) {

  const autoReload = config.autoReload ?? true;
  const reloadAfterChange = config.reloadAfterChange ?? true;

  const { http, ...appService } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [recordList, setRecordList] = useState([] as T[]);

  const reloadData = useStableCallback(async () => {
    try {
      setIsLoading(true);
      const resp = await http.post<{ list: T[] }>(
        `/general/${config.module}/list`,
        { pageSize: 999 },
      );
      setRecordList(resp.data.list);
      config.onAfterReload?.(resp.data.list);
    } catch (e) {
      showError(e);
    } finally {
      setIsLoading(false);
    }
  });

  const editRecord = useStableCallback(async (item: T | null) => {
    if (!config.detailPath) {
      notification.error({ description: `缺少detailPath参数` });
      return;
    }
    await router.navigate(`${config.detailPath}?id=${item?.id ?? "new"}`);
  });

  const createRecord = useStableCallback(() => editRecord(null));

  const copyRecord = useStableCallback(async (item: T) => {
    try {
      setIsLoading(true);
      const nowTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      await http.post<{ result: boolean }>(
        `/general/${config.module}/insert`,
        { row: { ...item, id: null, createdAt: nowTime, updatedAt: nowTime } },
      );
      if (reloadAfterChange) {await reloadData();}
      message.success("复制成功");
    } catch (e) {
      showError(e);
    } finally {
      setIsLoading(false);
    }
  });

  const deleteRecord = useStableCallback(async (item: T) => {
    try {
      setIsLoading(true);
      await http.post<{ result: boolean }>(
        `/general/${config.module}/delete`,
        { id: item.id },
      );
      if (reloadAfterChange) {await reloadData();}
      message.success("删除成功");
    } catch (e) {
      showError(e);
    } finally {
      setIsLoading(false);
    }
  });

  useMounted(async () => {
    if (autoReload) {
      await reloadData();
    }
  });

  return {
    http,
    ...appService,
    recordList,
    setRecordList,
    isLoading,
    setIsLoading,
    reloadData,
    editRecord,
    createRecord,
    copyRecord,
    deleteRecord,
  };
}
