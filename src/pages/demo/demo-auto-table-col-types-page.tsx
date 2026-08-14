import { Card } from "antd";
import { useAutoTable } from "../../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";
import { useMemo } from "react";

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

  autoTable.hooks.buttonConfigs.push(useMemo(() => {
    return {
      key: "custom",
      seq: -1,
      label: "覆盖字段",
      onClick: () => {
        autoTable.state.setTempColumns(
          [
            { "title": "选项值", "field": "selectVal", "type": "select", "options": [{ "label": "潜在客户", "value": "potential" }, { "label": "门店", "value": "store" }, { "label": "消费者", "value": "consumer" }], "width": "120px", "seq": 0, "fixed": "left" },
            { "title": "日期", "field": "dateVal", "type": "datetime", "width": "180px", "seq": 1, "fixed": "left" },
            { "title": "名称", "field": "normalText", "type": "input", "width": "120px", "seq": 2, "fixed": "center" },
            { "title": "数字", "field": "numberVal", "type": "number", "width": "120px", "seq": 3, "fixed": "center" },
            { "title": "整数", "field": "count", "type": "number", "width": "120px", "seq": 4, "fixed": "center" },
            { "title": "日期时间", "field": "createdAt", "type": "datetime", "width": "220px", "seq": 5, "fixed": "center" },
          ] as any,
        );
      },
    };
  }, [autoTable.state.setTempColumns]));

  return (
    <PageContainer>
      <Card>
        {autoTable.render()}
      </Card>
    </PageContainer>
  );
};
