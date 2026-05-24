import type { iAutoColumnMapper } from "./AutoColumn.utils.tsx";
import { CreateDefaultColumnConfig } from "./CreateDefaultColumnConfig.tsx";

declare module "./AutoColumn.utils.tsx" {
  interface iAutoColumnExpander {datetime: {};}
}

export type iAutoColumnDatetime = iAutoColumnMapper["datetime"]

export function installColumnDatetime() {
  CreateDefaultColumnConfig.datetime = (col) => {
    return CreateDefaultColumnConfig.date({ width: "220px", showTime: true, ...col, type: "datetime" as any }) as any;
  };
}
