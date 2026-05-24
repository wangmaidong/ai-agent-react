import { FilterConfiguration, type iFilterOptionMapper } from "../AutoFilter.utils.tsx";
import { Select } from "antd";
import { checkEmpty } from "../utils/checkEmpty.ts";
import { eFilterOperator } from "../AutoFilter.query.tsx";
import { toArray } from "@peryl/utils/toArray";

declare module "../AutoFilter.utils.tsx" {
  export interface iFilterOptionExpander {
    select: {
      options: { label: string, value: string }[]
    };
  }
}


export type iFilterOptionSelect = iFilterOptionMapper["select"]

export function installFilterSelect() {
  FilterConfiguration.addFilterSubType({
    filterType: "select",
    filterSubType: "in",
    label: "包含",
    getDescription: ({ value, filterOption }) => `${filterOption.label} 包含 ${getSelectDescription(value, filterOption)}`,
    filterEditor: ({ value, formData, form, filterOption }) => (
      <Select
        allowClear
        style={{ minWidth: "120px" }}
        value={value}
        onChange={(e) => form.setFieldsValue({ [filterOption.field]: e })} mode="multiple"
        options={filterOption.options}
      />
    ),
    getQueryParam: ({ formData, filterOption }) => {
      const { isEmpty, value, field } = checkEmpty(formData, filterOption);
      if (isEmpty) {return;}
      return { queries: [{ field, value, operator: eFilterOperator.in }] };
    },
  });

  FilterConfiguration.addFilterSubType({
    filterType: "select",
    filterSubType: "not_in",
    label: "不包含",
    getDescription: ({ value, filterOption }) => `${filterOption.label} 不包含 ${getSelectDescription(value, filterOption)}`,
    filterEditor: ({ value, formData, form, filterOption }) => (
      <Select allowClear style={{ minWidth: "120px" }} value={value} onChange={(e) => form.setFieldsValue({ [filterOption.field]: e })} mode="multiple">
        {filterOption.options.map(i => (
          <Select.Option key={i.value} value={i.value}>{i.label}</Select.Option>
        ))}
      </Select>
    ),
    getQueryParam: ({ formData, filterOption }) => {
      const { isEmpty, value, field } = checkEmpty(formData, filterOption);
      if (isEmpty) {return;}
      return { queries: [{ field, value, operator: eFilterOperator.not_in }] };
    },
  });

  FilterConfiguration.addFilterSubTypeNull("select");
  FilterConfiguration.addFilterSubTypeNotNull("select");
}

function getSelectDescription(value: any, filterOption: iFilterOptionSelect) {
  return toArray(value ?? [])
    .map(i => {
      const opt = (filterOption.options as any[]).find(opt => typeof opt === "string" ? opt === i : opt.value === i);
      if (!opt) {return String(i);}
      return typeof opt === "string" ? opt : opt.label;
    }).join(",");
}
