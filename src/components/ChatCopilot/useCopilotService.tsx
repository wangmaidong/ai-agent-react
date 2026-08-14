import { type iDrawerServiceConfig, useDrawerService } from "../../uses/useDrawerService.tsx";
import { useCallback } from "react";
import ResumeChatCopilot, { type iResumeChatCopilotProps } from "../../pages/resume/template/ResumeChatCopilot.tsx";
import { doNothing } from "@peryl/utils/doNothing";

export interface iCopilotServiceConfig extends iResumeChatCopilotProps {
  drawerServiceConfig?: Omit<iDrawerServiceConfig, "handleConfirm" | "handleCancel" | "content">;
}

export function useCopilotService() {

  const { openDrawer } = useDrawerService();

  const openCopilotService = useCallback((config: iCopilotServiceConfig) => {
    const { drawerServiceConfig, ...copilotProps } = config;
    return openDrawer({
      drawerWidth: 400,
      drawerProps: {
        headerStyle: { display: "none" },
        styles: {
          body: { padding: 0 },
        },
        footer: null,
      },
      content: <ResumeChatCopilot {...copilotProps} />,
      handleConfirm: doNothing,
      handleCancel: doNothing,
      ...drawerServiceConfig,
    });
  }, [openDrawer]);

  return { openCopilotService };
}
