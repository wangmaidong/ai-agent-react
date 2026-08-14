import { type iAutoTable } from "../useAutoTable.utils.tsx";
import { useCallback, useMemo } from "react";
import type { iFilterTip } from "../../AutoFilter/AutoFilter.tip.tsx";

export function useAutoTableSort(autoTable: iAutoTable) {

  const {
    state: { sortData, setSortData, renderColumnsRef },
    methods: { reload },
    hooks: { onClickTitle, onQueryParam, showTips },
  } = autoTable;

  onClickTitle.use(
    useCallback(({ column }) => {
      if (!column.sortable) {return;}

      if (sortData.length === 1 && sortData[0].field === column.dataIndex) {
        setSortData([{ ...sortData[0], desc: !sortData[0].desc }]);
      } else {
        setSortData([{ field: String(column.dataIndex), desc: true }]);
      }
      reload();
    }, [sortData]),
  );

  onQueryParam.use(useCallback((prevQueryParam) => {
    if (!!sortData.length) {
      prevQueryParam.orders = sortData;
    }
  }, [sortData]));

  // 当排序字段超过两个的时候，把这个字段的先后排序规则显示给用户
  const sortTip = useMemo((): iFilterTip | null => sortData.length <= 1 ? null : ({
    text: "按照 " + sortData.map(i =>
      `${renderColumnsRef.current.find(col => col.dataIndex === i.field)?.title ?? i.field} ${i.desc ? "降序" : "升序"}`,
    ).join(", "),
    clear: () => setSortData([]),
  }), [sortData]);
  showTips.push(sortTip);

}
