import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useCallback, useMemo, useRef, useState } from "react";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";
import { Button, Tooltip } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { AutoFilterForm } from "../components/AutoFilterForm.tsx";
import type { iMultipleFilterInstance } from "../../AutoFilter/MultipleFilter.tsx";
import type { iFilterTip } from "../../AutoFilter/AutoFilter.tip.tsx";
import { mergeQueryParam } from "../../AutoFilter/AutoFilter.query.tsx";

export function useAutoTableFilterForm(autoTable: iAutoTable) {

  const {
    runningConfig: {
      filterFormDefaultVisible,
      showFilterForm,
    },
    hooks: {
      onQueryParam,
      showTips,
    },
  } = autoTable;
  // 维护一个变量控制是否渲染查询表单
  const [isFilterFormVisible, setIsFilterFormVisible] = useState(!!filterFormDefaultVisible);
  const [filterTipList, setFilterTipList] = useState(null as null | iFilterTip[]);
  showTips.push(filterTipList);

  const multipleFilterRef = useRef(null as null | iMultipleFilterInstance);

  const bodyRenderMeta = useMemo((): iRenderMeta => {
    return {
      key: "filterForm",
      seq: 1,
      content: (
        <AutoFilterForm
          multipleFilterRef={multipleFilterRef}
          visible={isFilterFormVisible}
        />
      ),
    };
  }, [isFilterFormVisible]);

  autoTable.hooks.bodyRender.use(bodyRenderMeta);

  onQueryParam.use(
    useCallback(async (prevQueryParam) => {
      const { queryParam, filterTipList } = await multipleFilterRef.current!.getFilterData();
      setFilterTipList(filterTipList);
      return mergeQueryParam(prevQueryParam, queryParam);
    }, []),
  );

  // 用来展开，收起查询表单的按钮
  const searchRenderMeta = useMemo((): iRenderMeta | null => !showFilterForm ? null : ({
    key: "filterFormButton",
    seq: 2,
    content: <>
      <Tooltip title="展开/收起查询表单">
        <Button icon={<FileSearchOutlined />} onClick={() => setIsFilterFormVisible(prev => !prev)} />
      </Tooltip>
    </>,
  }), []);

  autoTable.hooks.searchRender.use(searchRenderMeta);

  return {
    filterForm: {},
  };
}

declare module "../useAutoTable.utils.tsx" {
  export interface iAutoTable {
    filterForm: ReturnType<typeof useAutoTableFilterForm>["filterForm"];
  }
}
