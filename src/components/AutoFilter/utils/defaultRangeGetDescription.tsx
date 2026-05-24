import type { PlainObject } from "@peryl/utils/event";
import type { iFilterOptionNumber } from "../types/filter.number.tsx";
import type { iFilterOptionDatetime } from "../types/filter.datetime.tsx";

/**
 * 默认的范围类型的handler的getDescription函数
 */
export const defaultRangeGetDescription = ({ formData, filterOption }: { formData: PlainObject, filterOption: iFilterOptionNumber | iFilterOptionDatetime }) => {
  const start = !formData[filterOption.filterStartField] ? null : `大于${formData[filterOption.filterStartField]}`;
  const end = !formData[filterOption.filterEndField] ? null : `小于${formData[filterOption.filterEndField]}`;
  if (!start && !end) {return null;}
  return filterOption.label + ` ` + [start, end].filter(Boolean).join(` 并且 `);
};
