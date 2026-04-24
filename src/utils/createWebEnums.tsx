/**
 * 【增强型 Web 枚举生成器】
 * * 作用：将简单的键值对对象转换为一个功能丰富的枚举对象。
 * 包含：双向映射 (Value <-> Label)、列表导出、自动推断的字面量属性。
 * * @example
 const Status = createWebEnums({
 OPEN: "待处理",
 CLOSED: "已关闭"
 } as const);
 * // 1. 直接访问属性 (带类型提示)
 Status.OPEN; // "OPEN"
 * // 2. 双向映射
 Status.labelMapper["OPEN"]; // "待处理"
 Status.valueMapper["待处理"]; // "OPEN"
 * // 3. 快速获取列表 (常用于渲染)
 Status.labelList; // ["待处理", "已关闭"]
 Status.selectOptions; // [{ value: "OPEN", label: "待处理" }, ...]
 * * @param enumParam - 原始枚举定义对象，建议结尾加上 `as const` 以获得最精准的类型推断
 */
 export function createWebEnums<T extends Record<string, string>>(enumParam: T) {
  type Keys = keyof T;
  type Labels = T[Keys];

  // 1. 构造基础映射和列表
  const base = {
    labelMapper: enumParam,
    valueMapper: Object.fromEntries(
      Object.entries(enumParam).map(([key, label]) => [label, key]),
    ) as Record<Labels, Keys>,

    labelList: Object.values(enumParam) as Labels[],
    valueList: Object.keys(enumParam) as Keys[],

    selectOptions: Object.entries(enumParam).map(([key, label]) => ({ label, value: key })) as { label: string, value: Keys }[],
  };

  // 2. 构造 Key 映射 (preview: "preview")
  const keyMirror = {} as { [K in Keys]: K };
  (Object.keys(enumParam) as Keys[]).forEach((key) => {
    keyMirror[key] = key;
  });

  // 3. 合并对象并强制指定返回类型
  return Object.assign(keyMirror, base) as typeof base & { [K in Keys]: K } & { TYPES: Keys };
}
