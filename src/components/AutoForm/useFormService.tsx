/*
* 表单抽屉服务，用来打开一个抽屉表单
*/
import { type iDrawerServiceConfig, useDrawerService } from "../../uses/useDrawerService.tsx";
import { useStableCallback } from "../../uses/useStableCallback.tsx";
import { AutoForm, type iAutoFormInstance, type iAutoFormProps } from "./AutoForm.tsx";
import type { iAutoColumn } from "../AutoColumn/AutoColumn.utils.tsx";
import type { PlainObject } from "@peryl/utils/event";

export interface iFormServiceConfig extends Omit<iDrawerServiceConfig, "handleConfirm" | "handleCancel" | "content"> {
  columns: iAutoColumn[],
  record: PlainObject,
  autoFormProps?: Partial<iAutoFormProps>,
  handleConfirm?: (formData: PlainObject) => void,
  handleCancel?: () => void,
}

export function useFormService() {

  const { openDrawer } = useDrawerService();

  const openFormDrawer = useStableCallback((config: iFormServiceConfig) => {

    const { columns, record, autoFormProps, ...drawerServiceConfig } = config;

    const autoFormRef = { current: null as null | iAutoFormInstance };

    return openDrawer({
      ...drawerServiceConfig,
      content: (
        <AutoForm
          onRef={autoFormRef}
          columns={columns}
          record={record}
          {...autoFormProps}
        />
      ),
      handleConfirm: async () => {
        const formData = await autoFormRef.current!.form.validateFields();
        return config.handleConfirm?.(formData);
      },
      handleCancel: () => {
        return config.handleCancel?.();
      },
    });
  });

  return { openFormDrawer };
}
