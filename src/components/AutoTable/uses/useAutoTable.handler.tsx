import { type iAutoTable } from "../useAutoTable.utils.tsx";
import React, { useCallback } from "react";
import type { PlainObject } from "@peryl/utils/event";

export function useAutoTableHandler(autoTable: iAutoTable) {
  const { methods: { editRecord } } = autoTable;

  const onClickRow = useCallback((data: { e: React.MouseEvent, record: PlainObject, index: number }) => {}, []);
  const onDoubleClickRow = useCallback(async (data: { e: React.MouseEvent, record: PlainObject, index: number }) => {
    await editRecord(data.record);
  }, [editRecord]);

  return {
    handler: {
      onClickRow,
      onDoubleClickRow,
    },
  };
}

export type iAutoTableHandler = ReturnType<typeof useAutoTableHandler>["handler"]

declare module "../useAutoTable.utils.tsx" {
  export interface iAutoTable {
    handler: iAutoTableHandler;
  }
}
