import { useAppContext } from "../AppService/useAppService";
import { useQuerySearch } from "./useQuerySearch";
import { useEffect, useState } from "react";
import { Form, message } from "antd";
import { getErrorMessage, showError } from "../utils/showError";
import { useStableCallback } from "./useStableCallback";
import { useIdGenerator } from "./useIdGenerator";
import { router } from "../layouts/routes";
import { useLocation } from "react-router";
import qs from "qs";

export function useDetailPage<T>(
  config: {
    module: string,                                                   // 模块名称
    onAfterReload?: (record: T, saveType: iDetailSaveType) => void,   // 处理详情数据加载之后的动作
    getNewRecord?: () => (T | Promise<T>)                             // 处理新建数据时的默认字段值
  },
) {
  const { module } = config;                  // 根据模块名称拼接得到对应的新建更新接口
  const { http } = useAppContext();           // Axios 实例
  const route = useLocation();                // 路由信息
  const querySearch = useQuerySearch();       // URL查询参数
  const nextId = useIdGenerator();            // 用来生成ID

  /*数据的id，有可能是new，或者真实的ID*/
  const id = querySearch.id as string | undefined;

  /*当前数据的保存方式，是新建还是编辑。这个值需要等到reloadRecord结束之后才能判断*/
  const [saveType, setSaveType] = useState<iDetailSaveType>("insert");

  /*用来判断页面是否初始化过reload*/
  const [hasInit, setHasInit] = useState(false);

  /*数据对象*/
  const [record, setRecord] = useState({ id } as T);

  /*页面加载状态*/
  const [isLoading, setIsLoading] = useState(true);

  /*是否正在保存*/
  const [isSaving, setIsSaving] = useState(false);

  /*初始化异常信息*/
  const [initializeError, setInitializeError] = useState(null as null | string);

  const [form] = Form.useForm();

  /*重新加载数据*/
  const reloadRecord = useStableCallback(async () => {

    if (id === "new") {
      /*如果id为new，那么就申请一个新的id，路由replace当前页面，重新渲染当前页面*/
      const id = await nextId();
      console.log("【新建】申请新的ID:" + id);
      await router.navigate(
        route.pathname + `?${qs.stringify({ ...querySearch, id })}`,
        { replace: true },
      );
      return;
    }

    setIsLoading(true);
    try {
      const resp = await http.post<{ result: T | null }>(`/general/${module}/item`, { id });
      const respSaveType = resp.data.result ? "update" : "insert";
      const respRecord = resp.data.result || (
        !config.getNewRecord ? { id } :
          { ...await config.getNewRecord(), id }
      );
      console.log(respSaveType === "insert" ? "新建数据" : "编辑数据", respRecord);
      setSaveType(respSaveType);
      setRecord(respRecord as any);
      config.onAfterReload?.(respRecord as any, respSaveType);
      form.setFieldsValue(respRecord);
    } catch (e) {
      showError(e);
      setInitializeError(getErrorMessage(e));
    } finally {
      setIsLoading(false);
      setHasInit(true);
    }
  });

  useEffect(() => {
    !!id && reloadRecord();
    /*id变化的时候重新加载数据*/
  }, [id, reloadRecord]);

  /*保存表单信息*/
  const save = useStableCallback(async (saveData: T) => {
    try {
      setIsSaving(true);
      const resp = await http.post<{ result: T }>(`/general/${module}/${saveType}`, { row: saveData });
      message.success("保存成功！");
      setRecord(resp.data.result);
      form.setFieldsValue(resp.data.result);
      /*保存之后，不论如何（现在是新建还是编辑）将编辑状态改为编辑*/
      setSaveType("update");
    } catch (e) {
      showError(e);
    } finally {
      setIsSaving(false);
    }
  });

  return {
    id,
    saveType,
    setSaveType,
    hasInit,
    setHasInit,
    record,
    setRecord,
    isLoading,
    setIsLoading,
    form,
    reloadRecord,
    save,
    isSaving,
    setIsSaving,
    initializeError,
    setInitializeError,
  };
}

export type iDetailSaveType = "insert" | "update";
