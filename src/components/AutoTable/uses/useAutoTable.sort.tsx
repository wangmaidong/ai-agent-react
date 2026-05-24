import { type iAutoTable } from "../useAutoTable.utils.tsx";
import { useCallback } from "react";

export function useAutoTableSort(autoTable: iAutoTable) {

  const {
    state: { sortData, setSortData },
    methods: { reload },
    hooks: { onClickTitle, onQueryParam },
  } = autoTable;

  onClickTitle.use(
    useCallback(({ column }) => {
      if (!column.sortable) {return;}

      if (sortData.length === 1) {
        /*处理切换排序额度字段情况，我们默认点击标题的时候，只使用一个字段排序*/

        if (sortData[0].field === column.dataIndex) {
          setSortData([{ ...sortData[0], desc: !sortData[0].desc }]);
        } else {
          setSortData([{ field: String(column.dataIndex), desc: true }]);
        }
      } else {
        /*没有排序字段或者排序字段超过1个*/

        setSortData([{ field: String(column.dataIndex), desc: true }]);
      }
      reload()
    }, [sortData]),
  );

  onQueryParam.use(useCallback((prevQueryParam) => {
    if (!!sortData.length) {
      prevQueryParam.orders = sortData;
    }
  }, [sortData]));

}
