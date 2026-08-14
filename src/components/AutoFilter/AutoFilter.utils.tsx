/*用来扩展的 filterOption 类型*/
import type { PlainObject } from "@peryl/utils/event";
import { type FormInstance, Input } from "antd";
import React from "react";
import { eFilterOperator, type iFilterHandlerQueryParam } from "./AutoFilter.query.tsx";
import { checkEmpty } from "./utils/checkEmpty.ts";
import { installFilterInput } from "./types/filter.input.tsx";
import { installFilterDatetime } from "./types/filter.datetime.tsx";
import { installFilterNumber } from "./types/filter.number.tsx";
import { installFilterSelect } from "./types/filter.select.tsx";

/*用来扩展 filterOption 的类型*/
export interface iFilterOptionExpander {}

/*filterOption的公共/基础参数类型*/
export interface iFilterOptionBase {
  field: string,          /*筛选的字段名*/
  label: string,          /*字段显示标题*/
  // filterType: string,  /*筛选类型，在iFilterOptionMapper中定义*/
  filterSubType: string,  /*筛选子类型*/
}

export type iFilterOptionMapper = { [k in keyof iFilterOptionExpander]: iFilterOptionBase & iFilterOptionExpander[k] & { filterType: k }; }
export type iFilterOption = iFilterOptionMapper[keyof iFilterOptionExpander];

export interface iFilterConfig<FilterType extends keyof iFilterOptionExpander> {
  filterType: FilterType,
  filterSubType: string,
  label: string,
  getDescription: (param: { value: any, formData: PlainObject, filterOption: iFilterOptionMapper[FilterType] }) => string | null,
  filterEditor: (param: { value: any, formData: PlainObject, form: FormInstance, filterOption: iFilterOptionMapper[FilterType], confirm: () => void }) => React.ReactElement,
  getQueryParam: (param: { value: any, formData: PlainObject, filterOption: iFilterOptionMapper[FilterType] }) => null | undefined | iFilterHandlerQueryParam | Promise<iFilterHandlerQueryParam>,
}

export const FilterConfiguration = (() => {
  const filterConfigMapper = {} as Record<keyof iFilterOptionExpander, Record<string, iFilterConfig<any>>>;

  function addFilterSubType<FilterType extends keyof iFilterOptionExpander>(filterConfig: iFilterConfig<FilterType>) {
    if (!filterConfigMapper[filterConfig.filterType]) {
      filterConfigMapper[filterConfig.filterType] = {};
    }
    (filterConfigMapper[filterConfig.filterType] as any)[filterConfig.filterSubType] = filterConfig;
  }

  function getFilterConfig(filterType: string, filterSubType: string): iFilterConfig<any> {
    const filterConfig = (filterConfigMapper as any)[filterType]?.[filterSubType];
    if (!filterConfig) {
      throw new Error("无法识别的筛选类型：" + filterType + ":" + filterSubType);
    }
    return filterConfig;
  }

  function getSubTypes(filterType: keyof iFilterOptionExpander): iFilterConfig<any>[] {
    const ret = filterConfigMapper[filterType] ?? {};
    return Object.values(ret);
  }

  const addFilterSubTypeNull = (filterType: keyof iFilterOptionExpander) => {
    addFilterSubType({
      filterType: filterType,
      filterSubType: "is_null",
      label: "为空",
      getDescription: ({ value, filterOption }) => `${filterOption.label} 为空`,
      filterEditor: ({ value, formData, form, filterOption }) => (
        <Input placeholder="为空" />
      ),
      getQueryParam: ({ formData, filterOption }) => {
        const { value, field } = checkEmpty(formData, filterOption);
        if (!field) {return null;}
        return { queries: [{ field, value, operator: eFilterOperator.is_null }] };
      },
    });
  };

  const addFilterSubTypeNotNull = (filterType: keyof iFilterOptionExpander) => {
    addFilterSubType({
      filterType: filterType,
      filterSubType: "is_not_null",
      label: "不为空",
      getDescription: ({ value, filterOption }) => `${filterOption.label} 不为空`,
      filterEditor: ({ value, formData, form, filterOption }) => (
        <Input placeholder="不为空" />
      ),
      getQueryParam: ({ formData, filterOption }) => {
        const { value, field } = checkEmpty(formData, filterOption);
        if (!field) {return null;}
        return { queries: [{ field, value, operator: eFilterOperator.is_not_null }] };
      },
    });
  };

  return {
    addFilterSubType,
    getFilterConfig,
    getSubTypes,
    addFilterSubTypeNull,
    addFilterSubTypeNotNull,
  };
})();

installFilterInput();
installFilterDatetime();
installFilterNumber();
installFilterSelect();
