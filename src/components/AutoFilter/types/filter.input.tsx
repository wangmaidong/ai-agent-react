import { FilterConfiguration, type iFilterOptionMapper } from "../AutoFilter.utils.tsx";
import { Input } from "antd";
import { checkEmpty } from "../utils/checkEmpty.ts";
import { eFilterOperator } from "../AutoFilter.query.tsx";

declare module "../AutoFilter.utils.tsx" {
  export interface iFilterOptionExpander {
    input: {};
  }
}

export type iFilterOptionInput = iFilterOptionMapper["input"]

export function installFilterInput() {

  FilterConfiguration.addFilterSubType({
    filterType: "input",
    filterSubType: "like",
    label: "类似于",
    getDescription: ({ value, filterOption }) => `${filterOption.label} 类似于 ${value}`,
    filterEditor: ({ value, formData, form, filterOption, confirm }) => (
      <Input
        value={value}
        onChange={(e) => form.setFieldsValue({ [filterOption.field]: e.target.value })}
        onKeyUp={e => e.keyCode === 13 && confirm()}
      />
    ),
    getQueryParam: ({ formData, filterOption }) => {
      const { isEmpty, value, field } = checkEmpty(formData, filterOption);
      if (isEmpty) {return;}
      const strVal = value as string;
      if (/[,，]/.test(strVal)) {
        const valList = strVal.split(/[,，]/g).map(item => item.trim()).filter(item => item);
        return { queries: [{ field, value: valList, operator: eFilterOperator.in_like }] };
      } else {
        return { queries: [{ field, value, operator: eFilterOperator.like }] };
      }
    },
  });

  FilterConfiguration.addFilterSubType({
    filterType: "input",
    filterSubType: "eq",
    label: "等于",
    getDescription: ({ value, filterOption }) => `${filterOption.label} 等于 ${value}`,
    filterEditor: ({ value, formData, form, filterOption, confirm }) => (
      <Input
        value={value}
        onChange={(e) => form.setFieldsValue({ [filterOption.field]: e.target.value })}
        onKeyUp={e => e.keyCode === 13 && confirm()}
      />
    ),
    getQueryParam: ({ formData, filterOption }) => {
      const { isEmpty, value, field } = checkEmpty(formData, filterOption);
      if (isEmpty) {return;}
      return { queries: [{ field, value, operator: eFilterOperator.eq }] };
    },
  });

  FilterConfiguration.addFilterSubTypeNull("input");
  FilterConfiguration.addFilterSubTypeNotNull("input");
}
