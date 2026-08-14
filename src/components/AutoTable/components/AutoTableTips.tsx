import { useAutoTableContext } from "../useAutoTable.utils.tsx";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import "./AutoTableTips.scss";
import { delay } from "@peryl/utils/delay";
import { useMemo } from "react";
import type { iFilterTip } from "../../AutoFilter/AutoFilter.tip.tsx";

export function AutoTableTips() {

  const {
    hooks: { showTips },
    methods: { reload },
  } = useAutoTableContext();

  const tipList = useMemo(() => {
    const list: iFilterTip[] = [];
    showTips.forEach((tip) => {
      if (tip == null) {return; }
      if (Array.isArray(tip)) {
        list.push(...tip.filter(i => i != null));
      } else {
        list.push(tip);
      }
    });
    return list;
    // eslint-disable-next-line
  }, [...showTips]);

  return !showTips.length ? null : (
    <div className="auto-table-tips">
      {tipList.map((tip) => (
        <div key={tip.text} className="auto-tip-item" onClick={async () => {
          tip.clear();
          await delay(23);
          reload();
        }}>
          <span>{tip.text}</span>
          <CloseOutlined />
        </div>
      ))}
    </div>
  );
}
