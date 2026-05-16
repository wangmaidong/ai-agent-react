import { useAutoTable } from "../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../components/PageContainer/PageContainer.tsx";
import { Card } from "antd";

export const HomePage = () => {

  const autoTable = useAutoTable({
    module: "user",
    columns: [
      { type: "input", title: "用户名", dataIndex: "username", key: "username" },
      { type: "select", options: [{ value: "选项一", label: "option_01" }], title: "用户昵称", dataIndex: "fullName", key: "fullName" },
    ],
  });

  return (
    <PageContainer>
      <Card>
        {autoTable.content}
      </Card>
    </PageContainer>
  );
};

export default HomePage;
