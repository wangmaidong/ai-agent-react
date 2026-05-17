import type { PlainObject } from "@peryl/utils/event.ts";
import type { iAutoColumn } from "../../AutoColumn/AutoColumn.utils.tsx";

export const AutoTableCell = (props: {
  value: any, record: PlainObject, index: number,
  col: iAutoColumn,
}) => {
  return (
    <td>
      {!props.col.inlineRender ? props.value : props.col.inlineRender?.({
        value: props.value,
        record: props.record,
        index: props.index,
        dataIndex: props.col.dataIndex!,
      })}
    </td>
  );
};
