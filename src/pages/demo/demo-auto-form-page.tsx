import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";
import { useMemo, useRef, useState } from "react";
import type { iAutoColumn } from "../../components/AutoColumn/AutoColumn.utils.tsx";
import { AutoForm, type iAutoFormInstance } from "../../components/AutoForm/AutoForm.tsx";
import { Button, Card, notification, Segmented, Space } from "antd";
import { showError } from "../../utils/showError.ts";

export default function Page() {

  const columns = useMemo((): iAutoColumn[] => [
    { type: "input", title: "用户名", dataIndex: "username", required: true },
    { type: "input", title: "用户昵称", dataIndex: "fullName" },
    { type: "toggle", title: "用户状态", dataIndex: "valid" },
    { type: "select", title: "用户角色", dataIndex: "role", options: [{ label: "管理员", value: "admin" }, { label: "普通用户", value: "user" }] },

    { type: "input", title: "用户名", dataIndex: "username", required: true },
    { type: "input", title: "用户昵称", dataIndex: "fullName" },
    { type: "select", title: "用户角色", dataIndex: "role", options: [{ label: "管理员", value: "admin" }, { label: "普通用户", value: "user" }] },

    { type: "input", title: "用户名", dataIndex: "username", required: true },
    { type: "input", title: "用户昵称", dataIndex: "fullName" },
    { type: "select", title: "用户角色", dataIndex: "role", options: [{ label: "管理员", value: "admin" }, { label: "普通用户", value: "user" }] },

    { type: "input", title: "用户名", dataIndex: "username", required: true },
    {
      type: "input", title: "全名", dataIndex: "userFullName", width: 400, editable: false,
      inlineRender: ({ record }) => (
        <span>{record.username ?? "无用户名"} {"->"} {record.fullName ?? "无昵称"}</span>
      ),
    },
  ], []);

  const autoFormRef = useRef(null as null | iAutoFormInstance);

  const [gridCols, setGridCols] = useState("3");

  const [editRecord] = useState(() => ({
    username: "zhangsan",
    fullName: "张三",
    role: "user",
  }));

  return <PageContainer>
    <Space vertical style={{ width: "100%" }}>
      <Card>
        <Button type="primary" onClick={async () => {
          try {
            const formData = await autoFormRef.current!.form.validateFields();
            notification.info({ title: "表单数据", description: JSON.stringify(formData) });
          } catch (e) {
            showError(e);
          }
        }}>获取表单数据</Button>
        <span style={{ marginLeft: "24px" }}>表单列数</span>：
        <Segmented options={["1", "2", "3"]} value={gridCols} onChange={setGridCols} />
      </Card>
      <Card>
        <AutoForm columns={columns} record={editRecord} ref={autoFormRef} gridCols={Number(gridCols)} />
      </Card>
    </Space>
  </PageContainer>;
}
