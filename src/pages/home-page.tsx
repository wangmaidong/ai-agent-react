import { Card } from "antd";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { useAutoTable } from "../components/AutoTable/useAutoTable.tsx";

export const HomePage = () => {

  const autoTable = useAutoTable(() => ({
    module: "user",
    columns: [
      { type: "input", title: "用户名", dataIndex: "username", key: "username", required: true },
      { type: "input", title: "用户名", dataIndex: "username", key: "username" },
      {
        type: "input", title: "用户昵称", dataIndex: "fullName", key: "fullName",
        width: 200,
        rules: [{ pattern: /^hello/, message: "必须以hello开头" }],
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

export default HomePage;
