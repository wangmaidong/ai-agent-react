import type { PlainObject } from "@peryl/utils/event.ts";
import type { iAutoColumn } from "../../AutoColumn/AutoColumn.utils.tsx";
import { useAutoTableCellEdit } from "./useAutoTableCellEdit.tsx";

export const AutoTableCell = (props: {
  value: any, record: PlainObject, index: number,
  col: iAutoColumn,
}) => {
  const { renderNormal, renderCellEditor, rowEditable } = useAutoTableCellEdit(props);
  return rowEditable ? renderCellEditor() : renderNormal(props.record, props.index);
};
