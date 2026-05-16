/*--------------------------------------- 查询相关 -------------------------------------------*/

/** 查询参数中的排序参数类型 */
export interface BatisQueryOrder {
  field: string;                            // 排序字段
  desc?: boolean;                           // 是否降序，默认 true
}

/** 查询参数中的筛选参数类型 */
export interface BatisQueryFilter {
  id?: string | null;                       // 筛选条件标识，当使用动态查询表达式时不能为空
  field: string;                            // 字段名
  value?: any | null;                       // 字段值
  operator?: string | null;                 // 操作符，默认 "="
  type?: string | null;                     // 筛选类型：string | number | date | datetime | time
}

/** 查询参数类型 */
export interface BatisQueryBody {
  page?: number | null;                     // 页码，默认 0
  pageSize?: number | null;                 // 每页数量，默认 5，范围 1~100
  onlyCount?: boolean | null;               // 是否只返回总数，是则返回 { total: number }
  withCount?: boolean | null;               // 是否一并查询总数，是则返回 { list: [], total: number, hasNext: boolean }
  all?: boolean | null;                     // 是否不分页查询所有数据

  orders?: BatisQueryOrder[] | null;        // 排序字段
  filters?: BatisQueryFilter[] | null;      // 筛选条件

  filterExpression?: string | null;         // 动态筛选表达式，如 f1 or f2 or (f3 and f4)
  distinctFields?: string[] | null;         // 要去重的字段
}

/** 查询结束数据类型 */
export interface QueryResponse<T = any> {
  list: T[] | null;                         // 查询结果
  total?: number | null;                    // 查询结果总数
  hasNext: boolean | null;                  // 是否有下一页，默认 false
}

export type BatisQueryResponse = QueryResponse<Record<string, any>>

/*--------------------------------------- item -------------------------------------------*/

// 型
export type BatisItemBody = Record<string, any>

// 单条查询结果
export interface BatisItemResponse {result?: Record<string, any> | null;}

/*--------------------------------------- insert -------------------------------------------*/

// 新建接口参数
export interface BatisInsertBody {row: Record<string, any>;}

// 新建接口响应数据类型
export interface BatisInsertResponse {
  result?: Record<string, any> | null;      // 新建数据插入成功之后重新查询得到的结果数据
  affectedRows?: number | null;             // 受影响的行数
}

/*--------------------------------------- batch insert -------------------------------------------*/

// 要新建的数据
export interface BatisBatchInsertBody {rows: Record<string, any>[];}

export interface BatisBatchInsertResponse {
  result?: Record<string, any>[] | null;    // 新建数据插入成功之后重新查询得到的结果数据
  affectedRows?: number | null;             // 受影响的行数
}

/*--------------------------------------- update -------------------------------------------*/

export interface BatisUpdateBody {
  row: Record<string, any>;                 // 更新的数据
  updateFields?: string[] | null;           // 要更新的字段
}

export interface BatisUpdateResponse {
  result?: Record<string, any> | null;      // 更新数据成功之后重新查询得到的结果数据
  affectedRows?: number | null;             // 受影响的行数
}

/*--------------------------------------- batch update -------------------------------------------*/

export interface BatisBatchUpdateBody {
  rows: Record<string, any>[];              // 要更新的数据
  updateFields?: string[] | null;           // 要更新的字段
}

export interface BatisBatchUpdateResponse {
  result?: Record<string, any>[] | null;     // 更新数据成功之后重新查询得到的结果数据
  affectedRows?: number | null;              // 受影响的行数
}

/*--------------------------------------- delete -------------------------------------------*/

// 删除接口参数类型
export interface BatisDeleteBody {id?: string[] | string | null;}

// 删除接口相应数据类型
export interface BatisDeleteResponse {affectedRows?: number | null;}
