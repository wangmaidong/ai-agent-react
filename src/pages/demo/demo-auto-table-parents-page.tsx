import { Card } from "antd";
import { useAutoTable } from "../../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";

export default function Page() {

  /*---------------------------------------autoTable 定义-------------------------------------------*/

  const autoTable = useAutoTable(() => ({
    module: "demo",
    queryParam: {
      queries: [
        { field: "selectVal", value: "store", operator: "=" },
      ],
    },
    defaultNewRow: {
      selectVal: "store",
    },
    columns: [
      { type: "input", title: "名称", dataIndex: "normalText", required: true },
      { type: "number", title: "数字", dataIndex: "numberVal" },
      { type: "number", title: "整数", dataIndex: "count" },
      {
        type: "select", title: "选项值", editable: false, dataIndex: "selectVal", options: [
          { label: "潜在客户", value: "potential" },
          { label: "店长", value: "store" },
          { label: "店员", value: "consumer" },
        ],
      },
      { type: "date", title: "日期", dataIndex: "dateVal" },
      { type: "datetime", title: "日期时间", dataIndex: "createdAt" },
    ],
  }));

  const subTable = useAutoTable(() => ({
    module: "demo",
    queryParam: {
      queries: [
        { field: "selectVal", value: "consumer", operator: "=" },
      ],
    },
    defaultNewRow: {
      selectVal: "consumer",
    },
    columns: [
      { type: "input", title: "名称", dataIndex: "normalText", required: true },
      { type: "number", title: "数字", dataIndex: "numberVal" },
      { type: "input", title: "父对象", dataIndex: "parentName" },
      {
        type: "select", title: "选项值", editable: false, dataIndex: "selectVal", options: [
          { label: "潜在客户", value: "potential" },
          { label: "店长", value: "store" },
          { label: "店员", value: "consumer" },
        ],
      },
    ],
    parentTable: autoTable,
    // 父子表字段映射
    // 字段的 parentName 就是父表的 normalText
    // 子表的 parentId 就是父表的id
    /*
    * 做第一个事情：查询
    * 子表查询的时候，根据这个这个字段映射，拼一个查询条件：
    * filter01 -->> { id:'f1' field: 'parentName', value: parentTable.singleSelect.singleSelectRecord.normalText }
    * filter02 -->> { id:'f2' field: 'parentId', value: parentTable.singleSelect.singleSelectRecord.id }
    *
    * 如果子表查询的时候，父表没有选中行，子表应该清理掉表格数据；
    *
    * 第二个事情，新建数据时的默认字段值：
    * {
    *   parentName: parentTable.singleSelect.singleSelectRecord.normalText,
    *   parentId:   parentTable.singleSelect.singleSelectRecord.id
    * }
    */
    parentKeyMap: { "parentName": "normalText", "parentId": "id" },
  }));

  return (
    <PageContainer>
      <Card>
        {autoTable.render()}
      </Card>
      <br />
      <Card>
        {subTable.render()}
      </Card>
    </PageContainer>
  );
};
