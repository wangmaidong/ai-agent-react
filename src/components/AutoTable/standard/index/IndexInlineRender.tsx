import { useAutoTableContext } from "../../useAutoTable.utils.tsx";
import type { PlainObject } from "@peryl/utils/event";
import "./IndexInlineRender.scss";
import { theme } from "antd";
import { useMemo } from "react";

export function IndexInlineRender(props: { record: PlainObject }) {
  const {
    methods: { getShowIndex },
    singleSelect: { singleSelectId },
  } = useAutoTableContext();

  const isSelected = useMemo(() => props.record.id === singleSelectId, [singleSelectId, props.record]);

  // 1. 引入 useToken 拿到当前主题的 token
  const { token: { colorPrimary } } = theme.useToken();

  const styles = useMemo(
    () => (isSelected ?
      { backgroundColor: colorPrimary, color: "white" } :
      { backgroundColor: "transparent", color: "black" }),
    [isSelected, colorPrimary],
  );

  return (
    <div className="auto-table-cell-index" style={styles}>
      {getShowIndex(props.record)}
    </div>
  );
}
