import { Card } from "antd";
import { useAutoTable } from "../../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";

export default function Page() {

  /*---------------------------------------autoTable 定义-------------------------------------------*/

  const autoTable = useAutoTable(() => ({
    module: "llm_user",
    columns: [
      { type: "input", title: "用户名", dataIndex: "username" },
      { type: "input", title: "用户昵称", dataIndex: "fullName" },
      { type: "datetime", title: "创建时间", dataIndex: "createdAt", editable: false },
      {
        type: "input", title: "全名", dataIndex: "userFullName", width: 400, editable: false, sortable: false,
        inlineRender: ({ record }) => (
          <span>{record.username} {"->"} {record.fullName}</span>
        ),
      },
    ],
  }));

  return (
    <PageContainer>
      <Card>
        {autoTable.render()}
      </Card>
    </PageContainer>
  );
};
