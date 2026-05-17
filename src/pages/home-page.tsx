import { useAutoTable } from "../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../components/PageContainer/PageContainer.tsx";
import { Card } from "antd";
import { type iAutoColumn } from "../components/AutoColumn/AutoColumn.utils.tsx";
import { useMounted } from "../uses/useMounted.tsx";
import { CreateDefaultColumnConfig } from "../components/AutoColumn/CreateDefaultColumnConfig.tsx";

export const HomePage = () => {

  const autoTable = useAutoTable({
    module: "user",
    columns: [
      { type: "input", title: "用户名", dataIndex: "username", key: "username" },
      { type: "select", options: [{ value: "选项一", label: "option_01" }], title: "用户昵称", dataIndex: "fullName", key: "fullName" },
    ],
  });

  useMounted(() => {

    const columns: iAutoColumn[] = [
      { type: "input", title: "用户名", dataIndex: "username", key: "username" },
      { type: "toggle", trueValue: true, falseValue: false },
      { type: "select", title: "用户昵称", dataIndex: "fullName", key: "fullName", options: ["有效", "失效"] },
    ];

    const autoColumns = columns.map(column => {
      return CreateDefaultColumnConfig[column.type](column as any);
    });

    console.log({
      columns,
      autoColumns,
    });
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
