import { useAutoTable } from "../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../components/PageContainer/PageContainer.tsx";
import { Card } from "antd";
import { type iAutoColumn } from "../components/AutoColumn/AutoColumn.utils.tsx";
import { useMounted } from "../uses/useMounted.tsx";
import { CreateDefaultColumnConfig } from "../components/AutoColumn/CreateDefaultColumnConfig.tsx";

export const HomePage = () => {

  const autoTable = useAutoTable(() => ({
    module: "user",
    columns: [
      { type: "input", title: "用户名", dataIndex: "username", key: "username" },
      { type: "input", title: "用户昵称", dataIndex: "fullName", key: "fullName" },
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

export default HomePage;
