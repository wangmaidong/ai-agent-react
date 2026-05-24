import { Card } from "antd";
import { useAutoTable } from "../../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";

export default function Page() {

  /*---------------------------------------autoTable 定义-------------------------------------------*/

  const autoTable = useAutoTable(() => ({
    module: "demo",
    columns: [
      { type: "input", title: "名称", dataIndex: "normalText", required: true },
      { type: "number", title: "数字", dataIndex: "numberVal" },
      { type: "number", title: "整数", dataIndex: "count" },
      { type: "select", title: "选项值", dataIndex: "selectVal", options: [{ label: "潜在客户", value: "potential" }, { label: "门店", value: "store" }, { label: "消费者", value: "consumer" }] },
      { type: "date", title: "日期", dataIndex: "dateVal" },
      { type: "datetime", title: "日期时间", dataIndex: "createdAt" },
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
