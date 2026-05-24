import type { iAutoColumn, iAutoColumnBase, iCreateDefaultColumnConfig } from "./AutoColumn.utils.tsx";
import { installColumnInput } from "./col.input.tsx";
import { installColumnSelect } from "./col.select.tsx";
import { installColumnToggle } from "./col.toggle.tsx";
import { installColumnOperation } from "../AutoTable/standard/operation/col.operate.tsx";
import { installColumnIndex } from "../AutoTable/standard/index/col.index.tsx";
import { installColumnCheck } from "../AutoTable/standard/check/col.check.tsx";
import { AutoTableCell } from "../AutoTable/components/AutoTableCell.tsx";
import { installColumnDate } from "./col.date.tsx";
import { installColumnDatetime } from "./col.datetime.tsx";
import { installColumnImage } from "./col.image.tsx";
import { installColumnNumber } from "./ol.number.tsx";
import { installColumnText } from "./col.text.tsx";
import { installColumnTextarea } from "./col.textarea.tsx";

export const CreateDefaultColumnConfig: iCreateDefaultColumnConfig = {} as any;

export function fillWithDefaultColumn(itemCol: iAutoColumn) {
  /*有type，是我们自定义的列类型*/
  const col = ({
    sortable: true,
    maxShowLen: 30,
    ...CreateDefaultColumnConfig[itemCol.type](itemCol as any),
  }) as iAutoColumn;
  return {
    render: (value, record, index) => (
      !col.dataIndex ?
        null :
        <AutoTableCell col={col} value={value} record={record} index={index} />
    ),
    ...col,
  } satisfies iAutoColumnBase;
}

installColumnInput();
installColumnSelect();
installColumnToggle();
installColumnDate();
installColumnDatetime();
installColumnImage();
installColumnNumber();
installColumnText();
installColumnTextarea();

installColumnOperation();
installColumnIndex();
installColumnCheck();
