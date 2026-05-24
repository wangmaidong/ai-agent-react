import type { iAutoColumnMapper } from "./AutoColumn.utils.tsx";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { CreateDefaultColumnConfig } from "./CreateDefaultColumnConfig.tsx";

declare module "./AutoColumn.utils.tsx" {
  interface iAutoColumnExpander {date: { showTime?: boolean };}
}

export type iAutoColumnDate = iAutoColumnMapper["date"]

export function installColumnDate() {
  CreateDefaultColumnConfig.date = (col) => {
    const showTime = !!col.showTime;
    return {
      width: "180px",
      getDescriptionPrompt: () => `字段名：${col.title}，字段标识：${String(col.dataIndex)}，说明：数据类型为${showTime ? "日期时间" : "日期"}，格式为${showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}`,
      inlineRender: ({ value }) => value,
      inlineEditor: () => <DatePicker showTime={showTime} />,
      getFormItemProps: () => ({
        getValueProps: (value) => ({ value: value ? dayjs(value) : null }),
        getValueFromEvent: (date) => date ? dayjs(date).format(showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD") : null,
      }),
      ...col,
    };
  };
}
