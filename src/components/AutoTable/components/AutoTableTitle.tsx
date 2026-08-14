import type { iAutoColumn } from "../../AutoColumn/AutoColumn.utils.tsx";
import { useAutoTableContext } from "../useAutoTable.utils.tsx";
import React, { useCallback, useMemo } from "react";
import { isElement } from "react-is";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import "./AutoTableTitle.scss";

export function AutoTableTitle(props: { col: iAutoColumn } & Record<string, any>) {
  const {
    state: { sortData },
    hooks: { onClickTitle },
  } = useAutoTableContext();

  const { col, ...leftProps } = props;

  const activateSortData = useMemo(() => !col.sortable ? null : sortData.find(i => i.field === col.dataIndex), [sortData, col]);

  const onClick = useCallback((e: React.MouseEvent) => {onClickTitle.exec({ column: col, e });}, [onClickTitle, col]);

  return (
    <div
      className="auto-table-title"
      data-active={String(!!activateSortData)}
      data-desc={String(!!activateSortData?.desc)}
      onClick={onClick}
    >
      {(() => {
        const Title = props.col.title as any;
        if (Title == null) {
          return Title;
        }
        if (typeof Title === "string" || typeof Title === "number" || typeof Title === "boolean") {
          return <span>{Title}</span>;
        } else {
          if (isElement(Title)) {return Title;}
          return <Title {...leftProps} />;
        }
      })()}
      <div className="auto-table-title-sorter">
        <CaretUpOutlined />
        <CaretDownOutlined />
      </div>
    </div>
  );
}
