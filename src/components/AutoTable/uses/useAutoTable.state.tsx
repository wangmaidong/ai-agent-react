import { useCallback, useMemo, useState } from "react";
import { type FormInstance, message } from "antd";
import { omit } from "@peryl/utils/omit.ts";
import { deepcopy } from "@peryl/utils/deepcopy.ts";
import type { AxiosRequestConfig } from "axios";
import type { PlainObject } from "@peryl/utils/event.ts";
import { useLoadingState } from "../../../uses/useLoadingState.ts";
import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { getRowsMapper } from "../../AutoColumn/AutoColumn.utils.tsx";
import type { BatisInsertResponse, BatisQueryBody, BatisQueryResponse, BatisUpdateResponse } from "../batis.type.tsx";
import { showError } from "../../../utils/showError.ts";
import { useRenderHook } from "../../../uses/useRenderHook.tsx";

export function useAutoTableState(autoTable: iAutoTable) {

  const {
    runningConfig,
    appService: { http },
  } = autoTable;

  /*---------------------------------------hooks-------------------------------------------*/

  const bodyRender = useRenderHook();
  const searchRender = useRenderHook();

  const hooks = {
    bodyRender,
    searchRender,
  };

  /*---------------------------------------state-------------------------------------------*/

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

  const state = useMemo(() => ({
    data, setData,
    statePagination, setStatePagination,
    editIdMapper,
    formInstanceManager,
    loading, isLoading,
  }), [
    data, setData,
    statePagination, setStatePagination,
    editIdMapper,
    formInstanceManager,
    loading, isLoading,
  ]);

  /*---------------------------------------methods-------------------------------------------*/

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

  /*用来计算行数据的索引*/
  const getShowIndex = useCallback((record: PlainObject) => {
    const index = data.findIndex(i => i.id === record.id);
    if (index === -1) {return index;}
    return (statePagination.current - 1) * statePagination.pageSize + index + 1;
  }, [data, statePagination]);

  const editRecord = useCallback(async (record: PlainObject | PlainObject[]) => {
    const recordList = Array.isArray(record) ? record : [record];
    // console.log("before", await getNewestValue(setStateUpdateIdMapper));
    setStateUpdateIdMapper(prevMapper => ({ ...prevMapper, ...getRowsMapper(recordList, { key: "id", value: () => true }) }));
    // console.log("after", await getNewestValue(setStateUpdateIdMapper));
  }, []);

  const deleteRecord = useCallback((record: PlainObject) => {}, []);

  /*保存行数据*/
  const requestUpsert = useCallback(async (
    { isCreatedRecord, sourceRecord, editRecord }: {
      sourceRecord: PlainObject, // 原始行数据
      editRecord: PlainObject,   // 编辑后的行数据
      isCreatedRecord: boolean, // 是否为行内编辑新建的数据
    },
  ) => {

    // 先获取行的索引
    const showIndex = getShowIndex(sourceRecord);

    const closeLoading = loading();
    try {

      const url = `/general/${runningConfig.module}/${isCreatedRecord ? "insert" : "update"}`;
      // 把undefined的值，设置为null，有些情况，发送网络请求的时候，undefined会被忽略掉，导致数据丢失
      /*将undefined的字段值修改为null，因为后端是按字段更新，undefined的字段在请求时会被过滤导致无法更新字段值*/
      editRecord = deepcopy(editRecord);
      Object.keys(editRecord).forEach(key => {editRecord[key] === undefined && (editRecord[key] = null);});

      const requestRecord = {
        ...sourceRecord,
        ...editRecord,
        // 如果id以new_为开头，说明是前端生成的行id，这里我们调接口保存的时候，清空掉id
        id: sourceRecord.id.startsWith("new_") ? null : sourceRecord.id,
      };

      const requestConfig: AxiosRequestConfig = {
        url,
        method: "post",
        data: { row: requestRecord },
      };

      const resp = await http.request<BatisInsertResponse | BatisUpdateResponse>(requestConfig);
      if (!resp.data.result) {
        throw new Error("保存返回数据为空");
      }
      // 更新表格数据
      setData(prevData => prevData.map(item => item.id === sourceRecord.id ? resp.data.result! : item));

      if (isCreatedRecord) {
        setStateCreateIdMapper(prevMapper => omit(prevMapper, [sourceRecord.id]));
      } else {
        setStateUpdateIdMapper(prevMapper => omit(prevMapper, [sourceRecord.id]));
      }
      message.success(`第${showIndex}行保存成功！`);
    } catch (e) {
      showError(e);
    } finally {
      closeLoading();
    }

  }, [getShowIndex, http, loading, runningConfig.module]);

  const saveRecord = useCallback(async (sourceRecord: PlainObject, validate = true) => {
    const isCreatedRecord = !!stateCreateIdMapper[sourceRecord.id];
    const showIndex = getShowIndex(sourceRecord);
    if (showIndex === -1) {
      showError("0x01，组件渲染异常，保存的数据不在表格数组中");
      return;
    }
    const form = formInstanceManager.get(sourceRecord);
    if (!form) {
      showError("0x02，组件渲染异常，找不到对应的表单实例");
      return;
    }
    let editRecord: PlainObject;
    try {
      if (validate) {
        editRecord = await form.validateFields();
      } else {
        editRecord = form.getFieldsValue();
      }
      return await requestUpsert({ isCreatedRecord, sourceRecord, editRecord });
    } catch (e) {
      showError(e);
    }
  }, [
    stateCreateIdMapper,
    getShowIndex,
    formInstanceManager,
    requestUpsert,
  ]);

  const cancelEditRecord = useCallback(async (record: PlainObject | PlainObject[]) => {
    const recordList = Array.isArray(record) ? record : [record];
    // console.log("before", await getNewestValue(setStateUpdateIdMapper));
    setStateUpdateIdMapper(prevMapper => omit(prevMapper, recordList.map(i => i.id)));
    // console.log("after", await getNewestValue(setStateUpdateIdMapper));
  }, []);

  const methods = useMemo(() => ({
    load, reload, editRecord,
    deleteRecord, saveRecord,
    cancelEditRecord, getShowIndex,
    formInstanceManager,
  }), [
    load, reload, editRecord,
    deleteRecord, saveRecord,
    cancelEditRecord, getShowIndex,
    formInstanceManager,
  ]);

  return {
    state,
    hooks,
    methods,
  };
}

export type iAutoTableState = ReturnType<typeof useAutoTableState>["state"]
export type iAutoTableMethods = ReturnType<typeof useAutoTableState>["methods"]
export type iAutoTableHooks = ReturnType<typeof useAutoTableState>["hooks"]

declare module "../useAutoTable.utils.tsx" {
  export interface iAutoTable {
    state: iAutoTableState,
    methods: iAutoTableMethods,
    hooks: iAutoTableHooks,
  }
}
