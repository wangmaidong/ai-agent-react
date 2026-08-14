import { type PlainObject } from "@peryl/utils/event";
import type { iFilterOption } from "../AutoFilter.utils.tsx";

/**
 * 判断是否有值
 */
export const checkEmpty = (formData: PlainObject, fieldOrOption: iFilterOption | string | undefined):
  {
    value: any
  } &
  ({ isEmpty: true, field: string | undefined } |
    { isEmpty: false, field: string }) => {
  let isEmpty = false;
  const field: string | undefined = typeof fieldOrOption === "object" ? fieldOrOption.field : fieldOrOption;
  if (!field) {
    return {
      isEmpty: true,
      value: null,
      field: undefined,
    };
  }
  const value = !field ? null : formData[field];
  if (value == null) {isEmpty = true;}
  if (typeof value === "string" && (!value || !value.trim())) {isEmpty = true;}
  if (Array.isArray(value) && value.length === 0) {isEmpty = true;}
  return {
    isEmpty,
    value,
    field,
  };
};
