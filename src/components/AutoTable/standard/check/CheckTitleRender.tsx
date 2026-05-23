import { useAutoTableContext } from "../../useAutoTable.utils.tsx";
import { Checkbox } from "antd";

export function CheckTitleRender() {

  const {
    multiSelect: { checkStatus, toggleCheckAll },
  } = useAutoTableContext();

  return (
    <Checkbox
      {...checkStatus === "check" ? { checked: true } : checkStatus === "half" ? { indeterminate: true } : { checked: false }}
      onClick={toggleCheckAll}
    />
  );
}
