import { type FormInstance } from "antd/es/form/hooks/useForm";
import type { iFilterOption } from "../AutoFilter.utils.tsx";

/*
* 用来清空 formData 中对应的字段的筛选值
*/
export function clearFilterTip(filterOption: iFilterOption, form: FormInstance) {
  if (filterOption.filterType === "number" || filterOption.filterType === "datetime") {
    if (filterOption.filterSubType === "range") {
      form.setFieldsValue({
        [filterOption.filterStartField]: null,
        [filterOption.filterEndField]: null,
      });
      return;
    }
  }
  form.setFieldValue(filterOption.field, null);
}
