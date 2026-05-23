import { useCallback, useMemo } from "react";
import { type iAutoTable } from "../useAutoTable.utils.tsx";
import type { PlainObject } from "@peryl/utils/event.ts";
import { Table, type TablePaginationConfig } from "antd";
import { AutoTableRow } from "../components/AutoTableRow.tsx";
import { CreateDefaultColumnConfig } from "../../AutoColumn/CreateDefaultColumnConfig.tsx";
import { AutoTableCell } from "../components/AutoTableCell.tsx";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";

export function useAutoTableContent(autoTable: iAutoTable) {

  const {
    runningConfig,
    state: { statePagination, data, isLoading, isTableEditing },
    methods: { load },
    hooks: { bodyRender },

  } = autoTable;
  const tablePropsColumns = useMemo(() => {
    const columns = [...runningConfig.columns];
    columns.push({ type: "input", width: undefined, dataIndex: "__fit__", editable: false });
    columns.push({ type: "operation" });
    return columns.map(col => {
      col = {
        ...CreateDefaultColumnConfig[col.type](col as any),
        ...col,
      };
      return {
        render: (value: any, record: PlainObject, index: number) => (
          <AutoTableCell
            value={value}
            record={record}
            index={index}
            col={col}
          />
        ),
        ...col,
      };
    });
  }, [runningConfig.columns]);

  /*设置table分页器*/
  const tablePropsPagination = useMemo((): TablePaginationConfig => ({
    ...statePagination,
    /*这里得取较大值，否则会导致新建数据时由于无法滚动导致底部的数据看不见*/
    pageSize: isTableEditing ? Math.max(statePagination.pageSize, data.length) : statePagination.pageSize,
    pageSizeOptions: runningConfig.paginationPageSizeOptions,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条`,
    onChange: async (page, pageSize) => load(page - 1, pageSize),
  }), [statePagination, data, runningConfig.paginationPageSizeOptions, load, isTableEditing]);

  /*修改table.props.onRow，给AutoTableRow组件传递record以及index参数*/
  const tablePropsOnRow = useCallback<any>((record: PlainObject, index: number) => ({ record, index }), []);

  const tablePropsComponent = useMemo(() => ({
    body: { row: AutoTableRow },
  }), []);


  const bodyRenderMeta = useMemo((): iRenderMeta => ({
    seq: 4,
    key: "table",
    content: () => (
      <Table
        dataSource={data}
        loading={isLoading}
        pagination={tablePropsPagination}
        columns={tablePropsColumns}
        onRow={tablePropsOnRow}
        components={tablePropsComponent}
        rowKey="id"
      />
    ),
  }), [
    data, isLoading,
    tablePropsPagination,
    tablePropsColumns,
    tablePropsOnRow,
    tablePropsComponent,
  ]);

  bodyRender.use(bodyRenderMeta);

  return {};
}
