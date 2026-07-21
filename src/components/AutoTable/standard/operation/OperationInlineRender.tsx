import type { PlainObject } from "@peryl/utils/event.ts";
import { useAutoTableContext } from "../../useAutoTable.utils.tsx";
import { Button, Popconfirm, Space } from "antd";
import { useMemo } from "react";

export function OperationInlineRender({ record }: { record: PlainObject }) {

  const {
    runningConfig: { showEditButton, showDeleteButton, showCreateButton },
    methods: { editRecord, deleteRecord, copyRecord },
  } = useAutoTableContext();

  return useMemo(() => (
    <Space>
      {!!showEditButton && <Button color="primary" variant="link" data-no-padding onClick={() => editRecord(record)}>编辑</Button>}
      {!!showCreateButton && <Button color="primary" variant="link" data-no-padding onClick={() => copyRecord(record)}>复制</Button>}
      {!!showDeleteButton && <Popconfirm title="确定删除？" onConfirm={() => deleteRecord(record)}><Button color="danger" variant="link" data-no-padding>删除</Button></Popconfirm>}
    </Space>
  ), [showCreateButton, showDeleteButton, showEditButton, record, editRecord, deleteRecord, copyRecord]);
}
