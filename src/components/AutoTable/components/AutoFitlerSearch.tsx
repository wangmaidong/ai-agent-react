import { useAutoTableContext } from "../useAutoTable.utils.tsx";
import React, { useMemo } from "react";
import { type iSingleFilterInstance, SingleFilter } from "../../AutoFilter/SingleFilter.tsx";

export function AutoFilterSearch(props: {
  singleFilterRef: React.Ref<iSingleFilterInstance | null>
}) {
  const {
    state: { renderColumnsRef },
    methods: { reload },
  } = useAutoTableContext();

  const renderColumns = useMemo(
    () => renderColumnsRef.current.filter(i => i != null && !i.standard && !!i.filterOption),
    // eslint-disable-next-line
    [renderColumnsRef, ...renderColumnsRef.current],
  );

  const filterOptionList = useMemo(() => renderColumns.map(i => i.filterOption!), [renderColumns]);

  return (
    <SingleFilter
      ref={props.singleFilterRef}
      filterOptionList={filterOptionList}
      onSearch={() => reload()}
    />
  );
}
