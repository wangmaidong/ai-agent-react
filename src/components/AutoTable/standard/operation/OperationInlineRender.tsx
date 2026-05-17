import type { PlainObject } from "@peryl/utils/event.ts";
import { useAutoTableContext } from "../../useAutoTable.utils.tsx";
import { Button, Popconfirm, Space } from "antd";

export function OperationInlineRender({ record }: { record: PlainObject }) {
  const { editRecord, deleteRecord } = useAutoTableContext();
  return (
    <Space>
      <Button color="primary" variant="link" data-no-padding onClick={() => editRecord(record)}>编辑</Button>
      <Button color="primary" variant="link" data-no-padding>复制</Button>
      <Popconfirm title="确定删除？" onConfirm={() => deleteRecord(record)}><Button color="danger" variant="link" data-no-padding>删除</Button></Popconfirm>
    </Space>
  );
}
