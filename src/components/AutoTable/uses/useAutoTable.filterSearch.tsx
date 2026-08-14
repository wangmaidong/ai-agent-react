import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useCallback, useMemo, useRef, useState } from "react";
import { Space } from "antd";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";
import { type iSingleFilterInstance } from "../../AutoFilter/SingleFilter.tsx";
import { mergeQueryParam } from "../../AutoFilter/AutoFilter.query.tsx";
import { AutoFilterSearch } from "../components/AutoFitlerSearch.tsx";
import type { iFilterTip } from "../../AutoFilter/AutoFilter.tip.tsx";

export function useAutoTableFilterSearch(autoTable: iAutoTable) {

  const { hooks: { searchRender, bodyRender, onQueryParam, showTips } } = autoTable;


  // 获取SingleFilter 的组件实例引用，用来拦截onQueryParam计算查询参数时，
  // 调用获取SingleFilter的getFilterData方法得到queryParam以及filterTip
  const singleFilterRef = useRef(null as null | iSingleFilterInstance);

  const [filterTip, setFilterTip] = useState(null as null | undefined | iFilterTip);
  showTips.push(filterTip);

  /*每次调用onQueryParam时，都会从singleFilterRef取筛选参数，以及更新 filterTip*/
  onQueryParam.use(useCallback(async (prevQueryParams) => {
    const { queryParam: newQueryParam, filterTip: newFilterTip } = await singleFilterRef.current!.getFilterData();
    setFilterTip(newFilterTip);
    return mergeQueryParam(prevQueryParams, newQueryParam);
  }, []));

  const searchRenderMeta = useMemo((): iRenderMeta | null => ({
    key: "search",
    seq: 1,
    content: (
      <Space.Compact>
        <AutoFilterSearch singleFilterRef={singleFilterRef} />
      </Space.Compact>
    ),
  }), []);

  searchRender.use(searchRenderMeta);

  searchRender.use(useMemo(() => ({
    key: "filler",
    seq: 5,
    content: <div className="filter-search-blank" style={{ flex: 1 }} />,
  }), []));

  const bodyRenderMeta = useMemo((): iRenderMeta | null => {
    return {
      key: "filterSearch",
      seq: 2,
      content: () => (
        <div className="auto-table-filter-search">
          {searchRender.render()}
        </div>
      ),
    };
  }, [searchRender]);

  bodyRender.use(bodyRenderMeta);

  return {};
}
