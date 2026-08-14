/*
* 表单抽屉服务，用来打开一个抽屉表单
*/
import { type iDrawerServiceConfig, useDrawerService } from "../../uses/useDrawerService.tsx";
import { useStableCallback } from "../../uses/useStableCallback.tsx";
import { AutoForm, type iAutoFormInstance, type iAutoFormProps } from "./AutoForm.tsx";
import type { iAutoColumn } from "../AutoColumn/AutoColumn.utils.tsx";
import type { PlainObject } from "@peryl/utils/event";
import { useCopilotService } from "../ChatCopilot/useCopilotService.tsx";
import { getFormSystemPrompt } from "./getFormSystemPrompt.tsx";

export interface iFormServiceConfig extends Omit<iDrawerServiceConfig, "handleConfirm" | "handleCancel" | "content"> {
  columns: iAutoColumn[],
  record: PlainObject,
  autoFormProps?: Partial<iAutoFormProps>,
  handleConfirm?: (formData: PlainObject) => void,
  handleCancel?: () => void,
}

export function useFormService() {

  const { openDrawer } = useDrawerService();

  const { openCopilotService } = useCopilotService();

  const openFormDrawer = useStableCallback((config: iFormServiceConfig) => {

    const { columns, record, autoFormProps, ...drawerServiceConfig } = config;

    const autoFormRef = { current: null as null | iAutoFormInstance };

    const fillWithCopilot = () => {
      const { closeModal } = openCopilotService({
        systemPrompt: getFormSystemPrompt(autoFormRef.current!.availableColumns),
        handleAiMessage: (message) => {
          const startTag = "/*---DataStart---*/";
          const endTag = "/*---DataEnd---*/";
          if (message.indexOf(endTag) > -1) {
            const startIndex = message.indexOf(startTag);
            const endIndex = message.indexOf(endTag);
            const jsonString = message.slice(startIndex + startTag.length, endIndex);
            const resultData = JSON.parse(jsonString);
            console.log(`大模型提取结果：`, resultData);
            Object.entries(record).forEach(([key, val]) => {
              if (resultData[key] == null) {resultData[key] = val;}
            });
            autoFormRef.current!.form.setFieldsValue(resultData);
            closeModal();
          }
        },
      });
    };

    return openDrawer({
      ...drawerServiceConfig,
      drawerProps: {
        ...drawerServiceConfig.drawerProps,
        title: "编辑表单",
      },
      footerLeft: (
        <div onClick={fillWithCopilot} className="gradient-text" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}>
          <i className="bi bi-soundwave"></i>
          <span style={{ marginLeft: "6px" }}>Vibe填写表单</span>
        </div>
      ),
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
