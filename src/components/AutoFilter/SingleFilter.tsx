import { useWatchFormData } from "../../uses/useWatchFormData";
import React, { useCallback, useImperativeHandle, useMemo, useState } from "react";
import { Button, Form, Select } from "antd";
import { FilterEditor } from "./FilterEditor";
import { SearchOutlined } from "@ant-design/icons";
import { type PlainObject } from "@peryl/utils/event";
import { clearFilterTip } from "./utils/clearFilterTip";
import { FilterConfiguration, type iFilterOption } from "./AutoFilter.utils.tsx";
import type { iFilterHandlerQueryParam } from "./AutoFilter.query.tsx";
import type { iFilterTip } from "./AutoFilter.tip.tsx";

export const SingleFilter = React.forwardRef<iSingleFilterInstance, iSingleFilterProps>((props: iSingleFilterProps, ref) => {

    const { formData, form } = useWatchFormData();
    const [filterOption, setFilterOption] = useState(() => {
      let defaultSearchFilterOption = props.filterOptionList[0] as iFilterOption | undefined;
      if (!!props.defaultSearchField) {
        defaultSearchFilterOption = props.filterOptionList.find(i => i.field === props.defaultSearchField) ?? defaultSearchFilterOption;
      }
      return defaultSearchFilterOption;
    });

    const getFilterData: iSingleFilterInstance["getFilterData"] = useCallback(async () => {
      if (!filterOption) {return { queryParam: null, formData, filterOption, filterTip: undefined };}
      const filterConfig = FilterConfiguration.getFilterConfig(filterOption.filterType, filterOption.filterSubType);
      const queryParam = await filterConfig.getQueryParam({ value: formData[filterOption.field], formData, filterOption });
      const filterTipText = !queryParam?.queries?.length ? null : filterConfig.getDescription({ value: formData[filterOption.field], formData, filterOption });
      return { queryParam, formData, filterOption, filterTip: !filterTipText ? null : { text: filterTipText, clear: () => {clearFilterTip(filterOption, form);} } };
    }, [filterOption, formData, form]);

    const ins = useMemo((): iSingleFilterInstance => ({ getFilterData }), [getFilterData]);

    useImperativeHandle(ref, () => ins);

    const fieldOptions = useMemo(() => props.filterOptionList.map(i => ({ label: i.label, value: i.field })), [props.filterOptionList]);

    const value = filterOption ?? props.filterOptionList[0];

    return !value ? null : (
      <Form component={false} form={form}>
        <FilterEditor
          value={value}
          onChange={setFilterOption}
          formData={formData}
          form={form}
          handleConfirm={props.onSearch}
          prepend={<Select
            style={{ minWidth: "100px" }}
            value={filterOption?.field}
            options={fieldOptions}
            onChange={(value) => {
              /*清理字段值*/
              form.setFieldsValue({
                [value]: null,
                [filterOption?.field ?? ""]: null,
              });
              setFilterOption(props.filterOptionList.find(i => i.field === value));
            }}
          />}
          append={<Button type="primary" onClick={props.onSearch}><SearchOutlined /><span>查询</span></Button>}
        />
      </Form>
    );
  },
);

export interface iSingleFilterProps {
  defaultSearchField?: string,
  filterOptionList: iFilterOption[],
  onSearch?: () => void,
}

export interface iSingleFilterInstance {
  getFilterData: () => Promise<{
    queryParam: iFilterHandlerQueryParam | null | undefined,
    formData: PlainObject,
    filterOption: iFilterOption | null | undefined,
    filterTip: iFilterTip | null | undefined
  }>;
}
