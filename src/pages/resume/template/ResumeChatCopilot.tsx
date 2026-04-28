import { CloudUploadOutlined, CommentOutlined, CopyOutlined, DislikeOutlined, LikeOutlined, OpenAIFilled, PaperClipOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import type { AttachmentsProps, BubbleListProps } from "@ant-design/x";
import { Attachments, Bubble, Conversations, Prompts, Sender, Suggestion, Think, Welcome } from "@ant-design/x";
import { BubbleListRef } from "@ant-design/x/es/bubble";
import XMarkdown, { type ComponentProps } from "@ant-design/x-markdown";
import { DefaultMessageInfo, OpenAIChatProvider, useXChat, useXConversations, XModelMessage, XModelParams, XModelResponse, XRequest } from "@ant-design/x-sdk";
import { Button, Flex, GetProp, GetRef, Image, message, notification, Popover, Select, Space } from "antd";
import { createStyles } from "antd-style";
import dayjs from "dayjs";
import React, { useImperativeHandle, useMemo, useRef, useState } from "react";
import locale from "./ResumeChatCopilot.locale";
import { pathJoin } from "@peryl/utils/pathJoin";
import env from "../../../AppService/env";
import { AIConfigs, AIConfigSelectOptions } from "../../../utils/AIConfigs";
import { useStableCallback } from "../../../uses/useStableCallback";
import { getNewestValue } from "../../../uses/getNewestValue";
import { isImageFile } from "../../../utils/isImageFile";
import { getImageBase64 } from "../../../utils/getImageBase64";
import { uuid } from "@peryl/utils/uuid";
import { useModelState } from "../../../uses/useModelState";
import { MessageInfo } from "@ant-design/x-sdk/es/x-chat";
import { doNothing } from "@peryl/utils/doNothing";

export interface iResumeChatCopilotProps {
  /*系统提示词*/
  systemPrompt?: string | (() => string | Promise<string>),
  /*处理AI返回的消息*/
  handleAiMessage?: (message: string, question: string) => void,
  /*处理AI返回的流式消息*/
  handleAiUpdate?: (chunkMessage: string) => void,
  /*输入内容*/
  value?: string,
  /*输入内容发生变化*/
  onChange?: (val?: string) => void,
  /*工具栏内容*/
  toolContent?: React.ReactNode,
  /*发送问题触发回调*/
  onSend?: (question: string) => (void | Promise<void>),
}

export interface iResumeChatCopilotInstance {
  send: (question: string) => void;
}

const ResumeChatCopilot = React.forwardRef<iResumeChatCopilotInstance, iResumeChatCopilotProps>((props: iResumeChatCopilotProps, ref) => {

  const { styles } = useCopilotStyle();
  const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);

  const [defaultConversation] = useState(() => ({ key: uuid(), label: locale.newSession, group: locale.today }));

  // ==================== State ====================
  const {
    conversations,
    activeConversationKey,
    setActiveConversationKey,
    addConversation,
    getConversation,
    setConversation,
  } = useXConversations({
    defaultConversations: [defaultConversation],
    defaultActiveConversationKey: defaultConversation.key,
  });
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [files, setFiles] = useState<GetProp<AttachmentsProps, "items">>([]);

  const [inputValue, setInputValue] = useModelState(props.value ?? "", props.onChange);
  const [aiConfigCode, setAIConfigCode] = useState(AIConfigs[0].aiConfigCode);

  const listRef = useRef<BubbleListRef>(null);
  const lastQuestionRef = useRef("");

  // ==================== Runtime ====================

  /*定义一个不变的函数来处理 XRequest callback onSuccess*/
  const handleRequestSuccess = useStableCallback(async (
    chunks: XModelResponse[],
    responseHeaders: Headers,
    message: MessageInfo<any> | undefined,
  ) => {
    props.handleAiMessage?.(message?.message.content, lastQuestionRef.current);
  });

  /*定义一个不变的函数来处理 XRequest callback onUpdate*/
  const handleRequestUpdate = useStableCallback(async (
    chunk: any,
    responseHeaders: Headers,
    message: MessageInfo<any> | undefined,
  ) => {
    if (chunk.data === "[DONE]") {return;}
    try {
      const chunkObj = JSON.parse(chunk.data);
      props.handleAiUpdate?.(chunkObj.choices[0].delta.content);
    } catch (e) {
      notification.error({ description: `解析ChunkMessage失败：` + chunk.data });
    }
  });

  /*定义一个不变的函数来处理 XRequest middlewares onRequest*/
  const handleMiddlewareRequest = useStableCallback(async (baseURL: any, options: any) => {
    console.log("onRequest", JSON.parse(options.body as any).messages);
    if (!!props.systemPrompt) {
      const systemPrompt = typeof props.systemPrompt === "function" ? await props.systemPrompt() : props.systemPrompt;
      const jsonBody = JSON.parse(options.body as any);
      const newMessages = jsonBody.messages;
      newMessages.unshift({ role: "system", content: systemPrompt });
      jsonBody.messages = newMessages;
      options.body = JSON.stringify(jsonBody);
    }
    return [baseURL, options];
  });

  const provider = useMemo(() => {
    return new OpenAIChatProvider({
      request: XRequest<XModelParams, XModelResponse>(
        pathJoin(env.baseURL, aiConfigCode, "/v1/chat/completions"),
        {
          manual: true,
          params: {
            model: aiConfigCode,
            stream: true,
            enable_thinking: false,
          },
          callbacks: {
            onSuccess: handleRequestSuccess,
            onError: doNothing,
            onUpdate: handleRequestUpdate,
          },
          middlewares: {
            onRequest: handleMiddlewareRequest as any,
          },
        }),
    });
  }, [aiConfigCode, handleRequestSuccess, handleRequestUpdate, handleMiddlewareRequest]);

  const { onRequest, messages, isRequesting, abort } = useXChat({
    // provider: providerFactory(activeConversationKey), // every conversation has its own provider
    provider: provider,
    conversationKey: activeConversationKey,
    defaultMessages: [] as DefaultMessageInfo<XModelMessage>[],
    requestPlaceholder: () => {
      return {
        content: locale.noData,
        role: "assistant",
      };
    },
    requestFallback: (_, { error, errorInfo, messageInfo }) => {
      if (error.name === "AbortError") {
        return {
          content: messageInfo?.message?.content || locale.requestAborted,
          role: "assistant",
        };
      }
      return {
        content: errorInfo?.error?.message || locale.requestFailed,
        role: "assistant",
      };
    },
  });

  // ==================== Event ====================
  const handleUserSubmit = useStableCallback(async (question: string) => {
    const newestFiles = await getNewestValue(setFiles);
    const userMessage: XModelMessage = { role: "user", content: question };

    if (!!newestFiles.length) {
      const notImageFiles = Array.from(newestFiles).filter(file => !isImageFile(file.originFileObj!));
      if (!!notImageFiles.length) {
        notification.error({ description: "暂不支持非图片文件上传" });
        return;
      }
      const base64StrList: string[] = await Promise.all(newestFiles.filter(i => isImageFile(i.originFileObj!)).map(i => getImageBase64(i.originFileObj!)));
      userMessage.content = [
        { type: "text", text: question },
        ...base64StrList.map(base64Str => ({ type: "image_url", image_url: { url: base64Str, detail: "high" } })),
      ] as any;
    }

    lastQuestionRef.current = question;
    await props.onSend?.(question);
    onRequest({ messages: [userMessage] });
    listRef.current?.scrollTo({ top: "bottom" });
    setFiles([]);
    setAttachmentsOpen(false);

    // session title mock
    const conversation = getConversation(activeConversationKey);
    if (conversation?.label === locale.newSession) {
      setConversation(activeConversationKey, { ...conversation, label: question?.slice(0, 20) } as any);
    }
  });

  useImperativeHandle(ref, (): iResumeChatCopilotInstance => ({ send: handleUserSubmit }));

  const onPasteFile = (files: FileList) => {
    Array.from(files).forEach(file => {
      attachmentsRef.current?.upload(file);
    });
    setAttachmentsOpen(true);
  };

  // ==================== Nodes ====================
  const chatHeader = (
    <div className={styles.chatHeader}>
      <div className={styles.headerTitle}>✨ {locale.aiCopilot}</div>
      <Space size={0}>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => {
            if (messages?.length) {
              const timeNow = dayjs().valueOf().toString();
              addConversation({ key: timeNow, label: "New session", group: "Today" });
              setActiveConversationKey(timeNow);
            } else {
              message.error(locale.itIsNowANewConversation);
            }
          }}
          className={styles.headerButton}
        />
        <Popover
          placement="bottom"
          styles={{ container: { padding: 0, maxHeight: 600 } }}
          content={
            <Conversations
              items={conversations?.map((i) =>
                i.key === activeConversationKey ? { ...i, label: `[current] ${i.label}` } : i,
              )}
              activeKey={activeConversationKey}
              groupable
              onActiveChange={setActiveConversationKey}
              styles={{ item: { padding: "0 8px" } }}
              className={styles.conversations}
            />
          }
        >
          <Button type="text" icon={<CommentOutlined />} className={styles.headerButton} />
        </Popover>
      </Space>
    </div>
  );
  const chatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        /** 消息列表 */
        <Bubble.List
          ref={listRef}
          items={messages?.map((i) => ({
            ...i.message,
            key: i.id,
            status: i.status,
            loading: i.status === "loading",
          }))}
          role={role}
        />
      ) : (
        /** 没有消息时的 welcome */
        <>
          <Welcome
            variant="borderless"
            title={`👋 ${locale.helloImAntDesignX}`}
            description={locale.baseOnAntDesign}
            className={styles.chatWelcome}
          />

          <Prompts
            vertical
            title={locale.iCanHelp}
            items={MOCK_QUESTIONS.map((i) => ({ key: i, description: i }))}
            onItemClick={(info) => handleUserSubmit(info?.data?.description as string)}
            styles={{
              title: { fontSize: 14 },
              root: { padding: "0 16px" },
            }}
          />
        </>
      )}
    </div>
  );
  const sendHeader = (
    <Sender.Header
      title={locale.uploadFile}
      styles={{ content: { padding: 0 } }}
      open={attachmentsOpen}
      onOpenChange={setAttachmentsOpen}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        beforeUpload={() => false}
        items={files}
        onChange={({ fileList }) => setFiles(fileList)}
        placeholder={(type) =>
          type === "drop"
            ? { title: locale.dropFileHere }
            : {
              icon: <CloudUploadOutlined />,
              title: locale.uploadFiles,
              description: locale.clickOrDragFilesToThisAreaToUpload,
            }
        }
      />
    </Sender.Header>
  );
  const chatSender = (
    <Flex vertical gap={12} className={styles.chatSend}>
      <Flex gap={12} justify="flex-end">
        {props.toolContent}
        <Select value={aiConfigCode} onChange={setAIConfigCode}>
          {AIConfigSelectOptions}
        </Select>
      </Flex>
      {/** 输入框 */}
      <Suggestion items={MOCK_SUGGESTIONS} onSelect={(itemVal) => setInputValue(`[${itemVal}]:`)}>
        {({ onTrigger, onKeyDown }) => (
          <Sender
            loading={isRequesting}
            value={inputValue}
            onChange={(v) => {
              onTrigger(v === "/");
              setInputValue(v);
            }}
            onSubmit={() => {
              handleUserSubmit(inputValue);
              setInputValue("");
            }}
            onCancel={() => {
              abort();
            }}
            allowSpeech
            placeholder={locale.askOrInputUseSkills}
            onKeyDown={onKeyDown}
            header={sendHeader}
            prefix={
              <Button
                type="text"
                icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                onClick={() => setAttachmentsOpen(!attachmentsOpen)}
              />
            }
            onPasteFile={onPasteFile}
          />
        )}
      </Suggestion>
    </Flex>
  );

  return (
    <div className={styles.copilotChat}>
      {/** 对话区 - header */}
      {chatHeader}

      {/** 对话区 - 消息列表 */}
      {chatList}

      {/** 对话区 - 输入框 */}
      {chatSender}
    </div>
  );
});

export default ResumeChatCopilot;

export type iUserMessageText = { type: "text", text: string }
export type iUserMessageImage = { type: "image_url", image_url: { url: string } }
export type iUserMessageVideo = { type: "video_url", image_url: { url: string } }
export type iUserMessageContent = string | (iUserMessageText | iUserMessageImage | iUserMessageVideo)[]

const role: BubbleListProps["role"] = {
  assistant: {
    placement: "start",
    footer: (
      <div style={{ display: "flex" }}>
        <Button type="text" size="small" icon={<ReloadOutlined />} />
        <Button type="text" size="small" icon={<CopyOutlined />} />
        <Button type="text" size="small" icon={<LikeOutlined />} />
        <Button type="text" size="small" icon={<DislikeOutlined />} />
      </div>
    ),
    contentRender(content: string) {
      const newContent = content.replace(/\n\n/g, "<br/><br/>");
      return (
        <XMarkdown
          content={newContent}
          components={{
            think: ThinkComponent,
          }}
        />
      );
    },
  },
  user: {
    placement: "end", contentRender: (content: iUserMessageContent) => {
      if (typeof content === "string") {
        return <div>{content}</div>;
      }
      const textItems: iUserMessageText[] = content.filter(i => i.type === "text") as any;
      const imgItems: iUserMessageImage[] = content.filter(i => i.type === "image_url") as any;
      return (
        <Space orientation="vertical">
          {imgItems.map((item, index) => (
            <Image src={item.image_url.url} alt={`image_${index + 1}`} style={{ borderRadius: "8px", overflow: "hidden" }} />
          ))}
          {textItems.map((item, index) => (
            <div key={index}>{item.text}</div>
          ))}
        </Space>
      );
    },
  },
};

const MOCK_SUGGESTIONS = [
  { label: locale.writeAReport, value: "report" },
  { label: locale.drawAPicture, value: "draw" },
  {
    label: locale.checkSomeKnowledge,
    value: "knowledge",
    icon: <OpenAIFilled />,
    children: [
      { label: locale.aboutReact, value: "react" },
      { label: locale.aboutAntDesign, value: "antd" },
    ],
  },
];
const MOCK_QUESTIONS = [
  locale.whatHasAntDesignXUpgraded,
  locale.whatComponentsAreInAntDesignX,
  locale.howToQuicklyInstallAndImportComponents,
];

const useCopilotStyle = createStyles(({ token, css }) => {
  return {
    copilotChat: css`
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      background: ${token.colorBgContainer};
      color: ${token.colorText};
    `,
    // chatHeader 样式
    chatHeader: css`
      height: 52px;
      box-sizing: border-box;
      border-bottom: 1px solid ${token.colorBorder};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 16px;
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
    `,
    headerButton: css`
      font-size: 18px;
    `,
    conversations: css`
      width: 300px;

      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    // chatList 样式
    chatList: css`
      flex: 1;
      overflow-y: auto;
      padding-inline: 16px;
      margin-block-start: ${token.margin}px;
      display: flex;
      flex-direction: column;
    `,
    chatWelcome: css`
      margin-inline: ${token.margin}px;
      padding: 12px 16px;
      border-radius: 12px;
      background: ${token.colorBgTextHover};
      margin-bottom: ${token.margin}px;
    `,
    loadingMessage: css`
      background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
    `,
    // chatSend 样式
    chatSend: css`
      padding: ${token.padding}px;
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
  };
});

const ThinkComponent = React.memo((props: ComponentProps) => {
  const [title, setTitle] = React.useState(`${locale.deepThinking}...`);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (props.streamStatus === "done") {
      setTitle(locale.completeThinking);
      setLoading(false);
    }
  }, [props.streamStatus]);

  return (
    <Think title={title} loading={loading}>
      {props.children}
    </Think>
  );
});
