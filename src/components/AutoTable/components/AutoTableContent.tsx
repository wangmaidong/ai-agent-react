import { useAutoTableContext } from "../useAutoTable.utils.tsx";
import React, { useCallback, useMemo } from "react";
import type { PlainObject } from "@peryl/utils/event.ts";
import { AutoTableRow } from "./AutoTableRow.tsx";
import { Table, type TablePaginationConfig } from "antd";
import type { iAutoColumn } from "../../AutoColumn/AutoColumn.utils.tsx";
import { insertSort } from "@peryl/utils/insertSort.ts";
import { CreateDefaultColumnConfig, fillWithDefaultColumn } from "../../AutoColumn/CreateDefaultColumnConfig.tsx";

/*
* 为了让 tablePropsColumns 尽可能最晚地执行（比所有模块函数晚执行），
* 这里我们专门抽离成一个 AutoTableContent 组件；
*/
export function AutoTableContent() {
  const {
    state: { statePagination, data, isLoading, isTableEditing },
    methods: { load }, runningConfig,
    hooks: { columnConfigs },
  } = useAutoTableContext();

  /*修改table.props.onRow，给AutoTableRow组件传递record以及index参数*/
  const tablePropsOnRow = useCallback<any>((record: PlainObject, index: number) => ({ record, index }), []);

  /*让table.props.components.body.row用AutoTableRow来渲染*/
  const tablePropsComponents = useMemo(() => ({ body: { row: AutoTableRow } }), []);

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

  const tablePropsColumns = useMemo(() => {

      const notNullColumnConfigs: iAutoColumn[] = columnConfigs.filter(i => i != null);

      /*填充默认值*/
      const formattedColumns = notNullColumnConfigs.map((itemCol) => {
        if ("type" in itemCol && itemCol.type in CreateDefaultColumnConfig) {
          return fillWithDefaultColumn(itemCol);
        } else {
          /*没有type，当做Table普通的列处理*/
          return itemCol;
        }
      });

      /*按照seq排序*/
      return insertSort(formattedColumns,
        (a, b) => {
          // 默认seq=0
          let aSeq = a.seq ?? 0;
          if (a.fixed === "left") {aSeq -= 100;}
          if (a.fixed === "right") {aSeq += 100;}
          let bSeq = b.seq ?? 0;
          if (b.fixed === "left") {bSeq -= 100;}
          if (b.fixed === "right") {bSeq += 100;}
          return aSeq > bSeq;
        });
    },
    // eslint-disable-next-line
    [columnConfigs, ...columnConfigs]);

  return useMemo(() => (
    <div className="auto-table-body">
      <Table
        dataSource={data}
        loading={isLoading}
        pagination={tablePropsPagination}
        columns={tablePropsColumns}
        components={tablePropsComponents}
        onRow={tablePropsOnRow}
        {...runningConfig.tableProps}
      />
    </div>
  ), [
    data,
    isLoading,
    tablePropsPagination,
    tablePropsColumns,
    tablePropsComponents,
    tablePropsOnRow,
    runningConfig.tableProps,
  ]);
}
