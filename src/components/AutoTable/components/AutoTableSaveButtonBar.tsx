import { Button } from "antd";
import { PlusOutlined, RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useMemo } from "react";
import { useAutoTableContext } from "../useAutoTable.utils.tsx";

/*
* AutoTable处于编辑状态时的按钮栏展示内容
*/
export function AutoTableSaveButtonBar() {

  const {
    runningConfig: { showCreateButton },
    methods: { createRecord, cancelEditRecord, save },
  } = useAutoTableContext();

  return useMemo(() => <>
    {showCreateButton && <Button icon={<PlusOutlined />} onClick={() => createRecord()}>继续新建</Button>}
    <Button icon={<RollbackOutlined />} onClick={() => cancelEditRecord()}>取消</Button>
    <Button icon={<SaveOutlined />} onClick={() => save()} type="primary">保存</Button>
  </>, [
    showCreateButton, createRecord, cancelEditRecord, save,
  ]);
}
