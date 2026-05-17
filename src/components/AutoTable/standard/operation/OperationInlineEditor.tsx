import { Button, Space } from "antd";
import type { PlainObject } from "@peryl/utils/event";
import { useAutoTableContext } from "../../useAutoTable.utils.tsx";

export function OperationInlineEditor({ record }: { record: PlainObject }) {
  const { methods: { cancelEditRecord, saveRecord } } = useAutoTableContext();
  return (
    <Space>
      <Button color="primary" variant="link" data-no-padding onClick={() => saveRecord(record)}>保存</Button>
      <Button color="danger" variant="link" data-no-padding onClick={() => cancelEditRecord(record)}>取消</Button>
    </Space>
  );
}
