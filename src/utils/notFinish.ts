import { notification } from "antd";

export function notFinish() {
  notification.warning({ description: "待完成" });
}
