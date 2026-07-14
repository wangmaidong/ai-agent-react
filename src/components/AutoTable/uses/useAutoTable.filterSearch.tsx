import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useMemo } from "react";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";
import { Button, Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export function useAutoTableFilterSearch(autoTable: iAutoTable) {

  const { hooks: { bodyRender, searchRender } } = autoTable;

  // 搜索栏渲染钩子增加显示一个搜索框：
  const searchRenderMeta = useMemo((): iRenderMeta | null => ({
    seq: 1,
    key: "search",
    content: (
      <Space.Compact>
        <Select defaultValue="username" options={[{ label: "用户名", value: "username" }, { label: "用户昵称", value: "fullName" }]} />
        <Input />
        <Button type="primary">
          <SearchOutlined />
          <span>查询</span>
        </Button>
      </Space.Compact>
    ),
  }), []);

  searchRender.use(searchRenderMeta);


  // 往表格纵向渲染钩子中，渲染搜索栏
  const bodyRenderMeta = useMemo((): iRenderMeta | null => {
    return {
      key: "filterSearch",
      seq: 2,
      content: () => (
        <div>
          <Space>
            {searchRender.render()}
          </Space>
        </div>
      ),
    };
  }, []);

  bodyRender.use(bodyRenderMeta);

  return {
    filterSearch: {},
  };
}

declare module "../useAutoTable.utils.tsx" {
  export interface iAutoTable {
    filterSearch: ReturnType<typeof useAutoTableFilterSearch>["filterSearch"];
  }
}
