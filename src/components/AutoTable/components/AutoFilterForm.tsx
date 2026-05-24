import { type iMultipleFilterInstance, MultipleFilter } from "../../AutoFilter/MultipleFilter.tsx";
import React, { useMemo } from "react";
import { useAutoTableContext } from "../useAutoTable.utils.tsx";

export function AutoFilterForm(props: {
  multipleFilterRef: React.Ref<iMultipleFilterInstance | null>,
  visible?: boolean
}) {

  const {
    state: { renderColumnsRef },
    methods: { reload },
  } = useAutoTableContext();

  const filterOptionList = useMemo(() => {
    return renderColumnsRef.current.filter(i => !!i && !!i.filterOption && !i.standard).map(i => i!.filterOption!);
  }, [renderColumnsRef.current, ...renderColumnsRef.current]);

  return (
    <MultipleFilter
      ref={props.multipleFilterRef}
      style={{ display: (props.visible ?? true) ? "flex" : "none" }}
      filterOptionList={filterOptionList}
      onSearch={reload}
    />
  );
}
