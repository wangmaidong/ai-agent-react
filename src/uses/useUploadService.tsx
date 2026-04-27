import { useAppContext } from "../AppService/useAppService";
import { notification } from "antd";
import { useStableCallback } from "./useStableCallback";
import { pathJoin } from "@peryl/utils/pathJoin";
import env from "../AppService/env";
import { iBaseRecord } from "../utils/type.utils";

export function useUploadService() {

  const { http, ...appContext } = useAppContext();

  const upload = useStableCallback(async (config: iUploadConfig) => {
    const { data, file } = config;
    const filename = config.filename ?? "file";
    const _action = config.action ?? "/save_file";
    const action = _action.startsWith("http") ? _action : pathJoin(env.uploadURL, _action);

    const formData = new FormData();

    if (!!data) Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    if (Array.isArray(file)) {
      file.forEach(f => formData.append(filename, f));
    } else {
      formData.append(filename, file);
    }

    try {
      const response = await http.post<any>(action, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          ...config.headers,
        },
        withCredentials: !!config.withCredentials,
        onUploadProgress: (e: any) => {
          const percent = Number((e.loaded / e.total * 100).toFixed(2));
          config.onProgress?.(percent, e);
        },
      });
      config.onSuccess?.(response.data.result);
      return response.data.result;
    } catch (e) {
      notification.error({ description: `上传失败,` + String(e).toString(), duration: false });
      config.onError?.(e as any);
      throw e;
    }
  });

  return {
    upload,
    ...appContext,
  };
}


export interface iUploadConfig {
  action?: string,                       // 上传地址
  file: File | File[],                   // 上传的文件
  filename?: string,                     // 上传文件接收的文件名
  data?: iUploadExternalData,            // 上传的额外数据
  headers?: Record<string, string>,      // 请求头
  withCredentials?: boolean,             // 是否带cookies凭证
  onProgress?: (percent: number, e: ProgressEvent) => void,
  onSuccess?: (data: string | Record<string, string>) => void,
  onError?: (e: ProgressEvent) => void,
}

export interface iFileRecord extends iBaseRecord {
  name?: string,      // 文件名称
  path?: string,      // 文件路径
  headId?: string,    // 父对象id
  attr1?: string,     // 扩展属性1
  attr2?: string,     // 扩展属性2
  attr3?: string,     // 扩展属性3
  content?: string,   // 扩展属性内容文本
}

export type iUploadExternalData = Omit<iFileRecord, "name" | "path" | keyof iBaseRecord>
