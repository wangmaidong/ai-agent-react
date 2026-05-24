import { Card, notification } from "antd";
import { useAutoTable } from "../../components/AutoTable/useAutoTable.tsx";
import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";
import { useMemo } from "react";
import type { iAutoTableConfigButton } from "../../components/AutoTable/useAutoTable.utils.tsx";

export default function Page() {

  /*---------------------------------------autoTable 定义-------------------------------------------*/

  const autoTable = useAutoTable(() => ({
    module: "llm_user",
    columns: [
      { type: "input", title: "用户名", dataIndex: "username" },
      { type: "input", title: "用户昵称", dataIndex: "fullName" },
      { type: "datetime", title: "创建时间", dataIndex: "createdAt", editable: false },
      {
        type: "input", title: "全名", dataIndex: "userFullName", width: 400, editable: false,
        inlineRender: ({ record }) => (
          <span>{record.username} {"->"} {record.fullName}</span>
        ),
      },
    ],
    showCheckColumn: true,
  }));
  // console.log("autoTable", autoTable);
  // console.log(autoTable.state.data.map(i => i.fullName));

  /*一个测试的按钮，用来展示选中的数据*/
  autoTable.hooks.buttonConfigs.push(useMemo((): iAutoTableConfigButton | null => !autoTable.runningConfig.showCheckColumn ? null : ({
    key: "showMultiSelectRows",
    label: "获取多选行",
    onClick: () => {
      const val = autoTable.multiSelect.checkedRows.map(i => i.fullName).join(", ") || "无选中数据";
      console.log({ val }, autoTable.multiSelect.checkedRows);
      notification.info({ description: val });
    },
  }), [autoTable.runningConfig.showCheckColumn, autoTable.multiSelect.checkedRows]));

  autoTable.hooks.onDoubleClickRow.use(({ record }) => {
    const index = autoTable.state.data.findIndex(i => i.id === record.id);
    console.log(index, record);
  });

  return (
    <PageContainer>
      <Card>
        {autoTable.render()}
      </Card>
    </PageContainer>
  );
};
