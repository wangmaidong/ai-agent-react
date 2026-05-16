import { useAutoTable } from "../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../components/PageContainer/PageContainer.tsx";

export const HomePage = () => {

  const autoTable = useAutoTable({
    module: "user",
    columns: [
      { title: "用户名", dataIndex: "username", key: "username" },
      { title: "用户昵称", dataIndex: "fullName", key: "fullName" },
    ],
  });

  return (
    <PageContainer>
      {autoTable.content}
    </PageContainer>
  );
};

export default HomePage;
