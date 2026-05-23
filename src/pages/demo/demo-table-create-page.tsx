import { useAutoTable } from "../../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";
import { Card } from "antd";

function Demo1() {
  const autoTable = useAutoTable(() => ({
    showFilterForm: true,
    module: "llm_user",
    columns: [
      { type: "input", title: "用户名", dataIndex: "username", required: true },
      { type: "input", title: "用户昵称", dataIndex: "fullName" },
    ],
  }));

  return (
    <PageContainer>
      <Card>
        {autoTable.render()}
      </Card>
    </PageContainer>
  );
}

export default Demo1;
