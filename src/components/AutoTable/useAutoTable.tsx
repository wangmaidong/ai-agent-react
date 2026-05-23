import { createAutoTableUser } from "./createAutoTableUser.tsx";
import { useMemo } from "react";
import { Alert } from "antd";

export const useAutoTable = createAutoTableUser({
  pageSize: 5,
});

export const useCrmTable = createAutoTableUser({
  pageSize: 5,
});

/*对接CRM的AutoTable，删除查询表单这个模块*/
useCrmTable.moduleMapper["filterForm"] = null;


/*对接Erp的AutoTable，多增加一个模块*/
export const useErpTable = createAutoTableUser({
  pageSize: 5,
});

/*添加一个模块*/
useErpTable.addModule(99, "vibeButton", (autoTable) => {

  const {
    state: { data },
    hooks: { searchRender },
  } = autoTable;

  searchRender.use(useMemo(() => {
    return {
      seq: 99,
      key: "custom",
      content: (<div>行数据：{data.length}</div>),
    };
  }, [data.length]));
});

/*覆盖一个模块*/
useErpTable.addModule(99, "filterForm", (autoTable) => {
  const {
    hooks: { bodyRender },
  } = autoTable;

  bodyRender.use(useMemo(() => ({
    seq: 99,
    key: "alert",
    content: <Alert description="更细公告" />,
  }), []));
});
