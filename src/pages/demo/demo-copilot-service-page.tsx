import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";
import { Button, Card, Input, Space } from "antd";
import { useCopilotService } from "../../components/ChatCopilot/useCopilotService.tsx";
import { useCallback, useState } from "react";

export default function Page() {

  const { openCopilotService } = useCopilotService();

  const [systemPrompt, setSystemPrompt] = useState("你必须用文言文回答问题");

  const openPageCopilotService = useCallback(async () => {
    openCopilotService({
      systemPrompt: systemPrompt,
      handleAiMessage: (message, question) => {
        console.log({ message, question });
      },
      handleAiUpdate: (chunkMessage) => {
        console.log("chunkMessage-->>", chunkMessage);
      },
    });
  }, [systemPrompt, openCopilotService]);

  return (
    <PageContainer>
      <Space vertical style={{ width: "100%" }}>
        <Card>
          <Button type="primary" onClick={openPageCopilotService}>打开大模型聊天服务抽屉</Button>
        </Card>
        <Card>
          <Input.TextArea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} />
        </Card>
      </Space>
    </PageContainer>
  );
}
