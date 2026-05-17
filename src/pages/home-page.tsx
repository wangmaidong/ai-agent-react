import { Card } from "antd";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { useAutoTable } from "../components/AutoTable/useAutoTable.tsx";

export const HomePage = () => {

  const autoTable = useAutoTable(() => ({
    module: "product",
    columns: [
      { type: "image", title: "预览图", dataIndex: "pictureUrl", imgHeight: 50 },
      { type: "input", title: "商品名称", dataIndex: "name", width: 500 },
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
