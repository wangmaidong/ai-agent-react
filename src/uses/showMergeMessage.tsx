import { message } from "antd";

type MessageType = "success" | "error" | "info" | "warning" | "loading";

const MERGE_WINDOW = 1000;
const messageQueue = new Map<string, number>();

const shouldShow = (content: string, type: MessageType): boolean => {
  const key = `${type}:${content}`;
  const now = Date.now();
  if (messageQueue.has(key) && now - messageQueue.get(key)! < MERGE_WINDOW) {
    return false;
  }
  messageQueue.set(key, now);
  setTimeout(() => messageQueue.delete(key), MERGE_WINDOW);
  return true;
};

export const showMergeMessage = (["success", "error", "info", "warning", "loading"] as const).reduce(
  (prev: any, type) => {
    prev[type] = (content: string) => shouldShow(content, type) && message[type](content);
    return prev;
  },
  {} as Record<MessageType, (content: string) => ReturnType<typeof message.success> | void>,
);
