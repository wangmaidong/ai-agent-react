import { Card } from "antd";
import { PageContainer } from "../components/PageContainer/PageContainer";
import { useAutoTable, useCrmTable, useErpTable } from "../components/AutoTable/useAutoTable.tsx";

function Demo1() {
  const autoTable = useAutoTable(() => ({
    module: "product",
    columns: [
      { type: "image", title: "预览图", dataIndex: "pictureUrl", imgHeight: 50 },
      { type: "input", title: "商品名称", dataIndex: "name", width: 500 },
    ],
  }));

  return (
    <PageContainer>
      <Card title="useAutoTable">
        {autoTable.render()}
      </Card>
    </PageContainer>
  );
}

function Demo2() {
  const autoTable = useCrmTable(() => ({
    module: "product",
    columns: [
      { type: "image", title: "预览图", dataIndex: "pictureUrl", imgHeight: 50 },
      { type: "input", title: "商品名称", dataIndex: "name", width: 500 },
    ],
  }));

  return (
    <PageContainer>
      <Card title="useCrmTable">
        {autoTable.render()}
      </Card>
    </PageContainer>
  );
}

function Demo3() {
  const autoTable = useErpTable(() => ({
    module: "product",
    columns: [
      { type: "image", title: "预览图", dataIndex: "pictureUrl", imgHeight: 50 },
      { type: "input", title: "商品名称", dataIndex: "name", width: 500 },
    ],
  }));

  return (
    <PageContainer>
      <Card title="useErpTable">
        {autoTable.render()}
      </Card>
    </PageContainer>
  );
}

export const HomePage = () => {
  return <>
    <Demo1 />
    <br/>
    <Demo2 />
    <br/>
    <Demo3 />
  </>;
};

export default HomePage;
