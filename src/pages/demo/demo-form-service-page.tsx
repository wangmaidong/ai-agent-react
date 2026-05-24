import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";
import { Button, Card, message, Segmented, Space } from "antd";
import { useFormService } from "../../components/AutoForm/useFormService.tsx";
import { useCallback, useMemo, useState } from "react";
import type { iAutoColumn } from "../../components/AutoColumn/AutoColumn.utils.tsx";

export default function Page() {

  const columns = useMemo((): iAutoColumn[] => [
    { type: "input", title: "用户名", dataIndex: "username", required: true },
    { type: "input", title: "用户昵称", dataIndex: "fullName" },
    { type: "select", title: "用户角色", dataIndex: "role", options: [{ label: "管理员", value: "admin" }, { label: "普通用户", value: "user" }] },
    {
      type: "input", title: "全名", dataIndex: "userFullName", width: 400, editable: false,
      inlineRender: ({ record }) => (
        <span>{record.username ?? "无用户名"} {"->"} {record.fullName ?? "无昵称"}</span>
      ),
    },
  ], []);

  const [gridCols, setGridCols] = useState(1);

  const [editRecord] = useState(() => ({
    username: "zhangsan",
    fullName: "张三",
    role: "user",
  }));

  const { openFormDrawer } = useFormService();

  const openPageFormDrawer = useCallback(async () => {
    openFormDrawer({
      columns: columns,
      record: editRecord,
      drawerWidth: gridCols * 400,
      autoFormProps: { gridCols: gridCols },
      handleConfirm: (formData) => {
        console.warn("handleConfirm");
        message.info(JSON.stringify(formData));
      },
      handleCancel: () => {
        console.warn("handleCancel");
        message.info("取消");
      },
    });
  }, [columns, gridCols]);

  return <PageContainer>
    <Space vertical style={{ width: "100%" }}>
      <Card>
        <Button onClick={openPageFormDrawer}>打开表单服务</Button>
        <span style={{ marginLeft: "24px" }}>表单列数</span>：
        <Segmented options={[1, 2, 3]} value={gridCols} onChange={setGridCols} />
      </Card>
    </Space>
  </PageContainer>;
}
