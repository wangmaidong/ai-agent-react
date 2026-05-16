import { type FormInstance, type FormItemProps, type TableColumnType } from "antd";
import React from "react";
import type { PlainObject } from "@peryl/utils/event";
import type { Rule } from "antd/es/form";

/*---------------------------------------types base-------------------------------------------*/

export interface iAutoColumnBase extends TableColumnType {
  seq?: number,                                               /*字段的显示顺序，左小右大*/
  dataIndex?: string,                                         /*dataIndex必须是字符串*/
  inlineRender?: iColInlineRender;                             /*非编辑状态下的渲染函数*/
  inlineEditor?: iColInlineEditor,                            /*行内编辑状态下的渲染函数*/
  formEditor?: iColFormEditor,                                /*表单编辑状态下的渲染函数*/
  getFormItemProps?: iColGetFormItemProps,                    /*渲染FormItem时额外的参数类型*/
  standard?: boolean,                                         /*是否为标准列（单选列、多选列、操作列、索引列）*/
  required?: boolean,                                         /*是否必填*/
  rules?: iColRules,                                          /*自定义校验规则*/
  editable?: iColEditable,                                    /*控制是否可编辑*/
  sortable?: boolean,                                         /*字段是否可以排序*/
  originTitle?: string,                                       /*字段标题*/
  maxShowLen?: number,                                        /*最大显示文本长度*/
  // filterOption?: iFilterOption,                            /*筛选配置信息*/
  // getFilterText?: (value: any) => string | Promise<string> /*将值转化为筛选条件显示值*/
}

/*编辑渲染函数参数类型*/
type iColEditParam = { record: PlainObject, index: number, formData: PlainObject, form: FormInstance, dataIndex: string, rules: Rule[] | undefined, }
/*行内非编辑时的渲染函数类型*/
type iColInlineRender = (param: { value: any, record: PlainObject, index: number, dataIndex: string, }) => React.ReactNode
/*行内编辑时的渲染函数类型*/
type iColInlineEditor = (param: iColEditParam) => React.ReactNode
/*表单编辑时的渲染函数类型*/
type iColFormEditor = (param: iColEditParam) => React.ReactNode
/*编辑时的表单校验参数类型*/
type iColRules = Rule[] | ((formData: PlainObject) => Rule[])
/*行内编辑控制参数类型*/
type iColEditable = boolean | ((record: PlainObject, index: number) => boolean)
/*用于计算编辑时传递给Form.Item的属性*/
type iColGetFormItemProps = (param: iColEditParam & { drawer: boolean }) => FormItemProps

/*用来扩展列特殊类型*/
export interface iAutoColumnExpander {}

// 有点像python列表推导式
export type iAutoColumnMapper = { [k in keyof iAutoColumnExpander]: (iAutoColumnExpander[k] & iAutoColumnBase & { type: k }) }

// type iAutoColumn = iAutoColumnInput | iAutoColumnSelect | iAutoColumnToggle
export type iAutoColumn = iAutoColumnMapper[keyof iAutoColumnExpander]

// const columns: iAutoColumn[] = [
//   { type: "input", title: "用户名", dataIndex: "username", key: "username" },
//   { type: "toggle", trueValue: true, falseValue: false },
//   { type: "select", title: "用户昵称", dataIndex: "fullName", key: "fullName", options: ["有效", "失效"] },
// ];

/*---------------------------------------separator-------------------------------------------*/

// interface iData {
//   input: string,
//   select: number,
//   toggle: boolean,
// }

//
// type iData2 = {
//   [k in keyof iData]: { type: k, value: iData[k] }
// }

// type iDataValues = iData[keyof iData]
