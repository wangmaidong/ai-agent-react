import type { PlainObject } from "@peryl/utils/event.ts";
import { Checkbox } from "antd";
import { useAutoTableContext } from "../../useAutoTable.utils.tsx";
import { useMemo } from "react";

export function CheckInlineRender(props: { record: PlainObject }) {

  const {
    multiSelect: { toggleCheckRow, isChecked },
  } = useAutoTableContext();

  const checked = useMemo(() => isChecked(props.record), [props.record, isChecked]);

  return (
    <Checkbox checked={checked} onClick={() => toggleCheckRow(props.record)} />
  );
}
