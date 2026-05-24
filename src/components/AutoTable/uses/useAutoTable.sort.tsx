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

      if (sortData.length === 1 && sortData[0].field === column.dataIndex) {
        setSortData([{ ...sortData[0], desc: !sortData[0].desc }]);
      } else {
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
