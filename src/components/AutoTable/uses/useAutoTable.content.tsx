import { useCallback, useMemo } from "react";
import { AutoTableContext, type iAutoTable } from "../useAutoTable.utils.tsx";
import type { PlainObject } from "@peryl/utils/event.ts";
import { Table, type TablePaginationConfig } from "antd";
import { AutoTableRow } from "../components/AutoTableRow.tsx";
import { CreateDefaultColumnConfig } from "../../AutoColumn/CreateDefaultColumnConfig.tsx";
import { AutoTableCell } from "../components/AutoTableCell.tsx";

export function useAutoTableContent(autoTable: iAutoTable) {

  const {
    runningConfig,
    state: { statePagination, data, isLoading },
    methods: { load },

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

  const tablePropsPagination = useMemo(() => {
    return ({
      ...statePagination,
      showTotal: (total) => `共 ${total} 条数据`,
      showSizeChanger: true,
      pageSizeOptions: runningConfig.paginationPageSizeOptions,
      onChange: (page, pageSize) => load(page - 1, pageSize),
    }) satisfies TablePaginationConfig;
  }, [
    statePagination,
    runningConfig.paginationPageSizeOptions,
    load,
  ]);

  /*修改table.props.onRow，给AutoTableRow组件传递record以及index参数*/
  const tablePropsOnRow = useCallback<any>((record: PlainObject, index: number) => ({ record, index }), []);

  const tablePropsComponent = useMemo(() => ({
    body: { row: AutoTableRow },
  }), []);

  const render = useCallback(() => null as any, []);

  return {
    render: () => (
      <AutoTableContext.Provider value={autoTable}>
        <div>
          <Table
            dataSource={data}
            loading={isLoading}
            pagination={tablePropsPagination}
            columns={tablePropsColumns}
            onRow={tablePropsOnRow}
            components={tablePropsComponent}
            rowKey="id"
          />
        </div>
      </AutoTableContext.Provider>
    ),
  };
}
