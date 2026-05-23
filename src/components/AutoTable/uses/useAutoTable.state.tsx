import React, { useCallback, useEffect, useMemo, useState } from "react";
import { type FormInstance, message } from "antd";
import { omit } from "@peryl/utils/omit.ts";
import { deepcopy } from "@peryl/utils/deepcopy.ts";
import type { AxiosRequestConfig } from "axios";
import type { PlainObject } from "@peryl/utils/event.ts";
import { useLoadingState } from "../../../uses/useLoadingState.ts";
import type { iAutoTable, iAutoTableConfigButton } from "../useAutoTable.utils.tsx";
import { getRowsMapper } from "../../AutoColumn/AutoColumn.utils.tsx";
import type { BatisDeleteResponse, BatisInsertResponse, BatisQueryBody, BatisQueryResponse, BatisUpdateResponse } from "../batis.type.tsx";
import { showError } from "../../../utils/showError.ts";
import { useRenderHook } from "../../../uses/useRenderHook.tsx";
import { AutoTableSaveButtonBar } from "../components/AutoTableSaveButtonBar.tsx";
import { uuid } from "@peryl/utils/uuid";
import { useIdGenerator } from "../../../uses/useIdGenerator.ts";
import { toArray } from "@peryl/utils/toArray";
import { showMergeMessage } from "../../../uses/showMergeMessage.tsx";

export function useAutoTableState(autoTable: iAutoTable) {

  const {
    runningConfig,
    appService: { http },
  } = autoTable;

  const nextId = useIdGenerator();

  /*---------------------------------------hooks-------------------------------------------*/

  const [buttonConfigs] = useState([] as (iAutoTableConfigButton | null | undefined)[]);
  buttonConfigs.splice(0, buttonConfigs.length);

  const bodyRender = useRenderHook();
  const searchRender = useRenderHook();

  const hooks = useMemo(() => ({
    bodyRender,
    searchRender,
    buttonConfigs,
  }), [
    bodyRender,
    searchRender,
    buttonConfigs,
  ]);

  /*---------------------------------------state-------------------------------------------*/

  const [data, setData] = useState([] as PlainObject[]);

  /*分页状态数据*/
  const [statePagination, setStatePagination] = useState(() => ({
    pageCurrent: 1,
    pageSize: runningConfig.pageSize,
    total: 0,
  }));

  /*标记哪些id的row被开启了编辑状态*/
  const [stateUpdateIdMapper, setStateUpdateIdMapper] = useState({} as Record<string, boolean | undefined>);

  /*标记哪些id的row是新建的行编辑状态*/
  const [stateCreateIdMapper, setStateCreateIdMapper] = useState({} as Record<string, boolean | undefined>);

  /*哪些row的id应该开启编辑状态，新建以及编辑的行都应该开启编辑状态*/
  const editIdMapper = useMemo(() => ({ ...stateUpdateIdMapper, ...stateCreateIdMapper }), [stateUpdateIdMapper, stateCreateIdMapper]);

  /*判断表格是否处于编辑状态*/
  const isTableEditing = useMemo(() => Object.values(editIdMapper).some(i => !!i), [editIdMapper]);

  /*用来通过record找到FormInstance的一个管理器*/
  const [formInstanceManager] = useState(() => new WeakMap<PlainObject, FormInstance>());

  const { loading, isLoading } = useLoadingState();

  /*用来控制按钮的渲染，当这个【overrideButtonContent】有值的时候，渲染这个值*/
  const [overrideButtonContent, setOverrideButtonContent] = useState(null as null | React.ReactNode);

  useEffect(() => {
    // eslint-disable-next-line
    if (isTableEditing) {setOverrideButtonContent(<AutoTableSaveButtonBar />);}
    return () => {setOverrideButtonContent(null);};
  }, [isTableEditing]);

  const state = useMemo(() => ({
    data, setData,
    statePagination, setStatePagination,
    editIdMapper, isTableEditing,
    formInstanceManager,
    loading, isLoading,
    overrideButtonContent,
  }), [
    data, setData,
    statePagination, setStatePagination,
    editIdMapper, isTableEditing,
    formInstanceManager,
    loading, isLoading,
    overrideButtonContent,
  ]);

  /*---------------------------------------methods-------------------------------------------*/

  /*page是从0开始的*/
  const load = useCallback(async (page?: number, pageSize?: number) => {
    page = page ?? statePagination.pageCurrent - 1;
    pageSize = pageSize ?? statePagination.pageSize;
    const closeLoading = loading();
    try {
      const resp = await http.post<BatisQueryResponse>(`/general/${runningConfig.module}/list`, {
        page: page,
        pageSize: pageSize,
        withCount: true,
      } satisfies BatisQueryBody);
      setData(resp.data.list ?? []);
      setStatePagination({ pageSize, pageCurrent: page + 1, total: resp.data.total ?? resp.data.list?.length ?? 0 });
    } catch (e) {
      showError(e);
    } finally {
      closeLoading();
    }
  }, [runningConfig.module, http, loading, statePagination]);

  const reload = useCallback(() => load(0, statePagination.pageSize), [load, statePagination.pageSize]);

  /*用来计算行数据的索引*/
  const getShowIndex = useCallback((record: PlainObject) => {
    const index = data.findIndex(i => i.id === record.id);
    if (index === -1) {return index;}
    return (statePagination.pageCurrent - 1) * statePagination.pageSize + index + 1;
  }, [data, statePagination]);

  const editRecord = useCallback(async (record: PlainObject | PlainObject[]) => {
    const recordList = Array.isArray(record) ? record : [record];
    // console.log("before", await getNewestValue(setStateUpdateIdMapper));
    setStateUpdateIdMapper(prevMapper => ({ ...prevMapper, ...getRowsMapper(recordList, { key: "id", value: () => true }) }));
    // console.log("after", await getNewestValue(setStateUpdateIdMapper));
  }, []);

  const deleteRecord = useCallback(async (record: PlainObject) => {
    const requestConfig: AxiosRequestConfig = {
      url: `/general/${runningConfig.module}/delete`,
      method: "post",
      data: { id: record.id },
    };
    const closeLoading = loading();
    try {
      const resp = await http.request<BatisDeleteResponse>(requestConfig);
      if (resp.data.affectedRows != null && resp.data.affectedRows >= 1) {
        message.success("删除成功！");
      } else {
        message.error("删除失败！");
      }
      await load();
    } catch (e) {
      showError(e);
    } finally {
      closeLoading();
    }
  }, [load, runningConfig.module, http, loading]);

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
      showMergeMessage.success(`保存成功！`);
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

  /*取消行数据的编辑状态，如果是新建数据要删除*/
  const cancelEditRecord = useCallback(async (record?: PlainObject | PlainObject[]) => {
    /*没有传递record，就说明是取消所有行的编辑动作，否则目标行数据的编辑动作*/
    const targetRows = !record ? data : toArray(record);
    /*将targetRows转成id mapper*/
    const targetIdMapper = getRowsMapper(targetRows, { key: "id", value: () => true });
    /*获取最新的StateCreateIdMapper，用于删除stateData中的新建数据*/
    const newestStateCreateIdMapper = stateCreateIdMapper;

    setData(prevList => prevList.filter(i => !(!!newestStateCreateIdMapper[i.id] && !!targetIdMapper[i.id])));
    setStateUpdateIdMapper(prevMapper => !record ? {} : omit(prevMapper, Object.keys(targetIdMapper)));
    setStateCreateIdMapper(prevMapper => !record ? {} : omit(prevMapper, Object.keys(targetIdMapper)));
  }, [data, stateCreateIdMapper]);

  /*获取一条默认的新行数据*/
  const { defaultNewRow, defaultNewRowId } = runningConfig;
  const getDefaultNewRow = useCallback(async (initialValues?: PlainObject) => {
    const initialNewRecord: Record<string, any> = deepcopy(
      initialValues ?? (!defaultNewRow ? {} : (
        typeof defaultNewRow === "function" ? await defaultNewRow() : defaultNewRow
      )),
    );
    if (!initialNewRecord.id) {
      if (defaultNewRowId) {
        /*从后端取一个真实有效不可能冲突的id*/
        initialNewRecord.id = await nextId();
      } else {
        /*前端临时给一个id，在保存的时候，检测如果是前端生成的id，发请求保存的时候去掉这个id*/
        initialNewRecord.id = `new_${uuid()}`;
      }
    }
    return initialNewRecord;
  }, [defaultNewRow, defaultNewRowId, nextId]);

  /*新建一条数据*/
  const createRecord = useCallback(async (initialValues?: PlainObject | PlainObject[]) => {
    const initialRecords = await Promise.all(toArray(initialValues).map(item => getDefaultNewRow(item)));
    setData(prevList => [...initialRecords, ...prevList]);
    /*将新建的行数据标记为新建数据*/
    setStateCreateIdMapper(prevMapper => ({ ...prevMapper, ...getRowsMapper(initialRecords, { key: "id", value: () => true }) }));
  }, [getDefaultNewRow]);

  /*复制一行或者多行数据*/
  const copyRecord = useCallback(async (record: PlainObject) => {
    const { id, createdAt, createdBy, updatedAt, updatedBy, ...leftRecord } = record;
    return createRecord(leftRecord);
  }, [createRecord]);

  /*保存数据*/
  const save = useCallback(async () => {
    const editRecords = data.filter(i => editIdMapper[i.id]);
    editRecords.map(i => saveRecord(i));
  }, [data, editIdMapper, saveRecord]);

  const methods = useMemo(() => ({
    load, reload, editRecord,
    deleteRecord, saveRecord,
    cancelEditRecord, getShowIndex,
    formInstanceManager,
    copyRecord, createRecord, save,
  }), [
    load, reload, editRecord,
    deleteRecord, saveRecord,
    cancelEditRecord, getShowIndex,
    formInstanceManager,
    copyRecord, createRecord, save,
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
