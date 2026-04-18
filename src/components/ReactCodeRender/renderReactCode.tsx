import { uuid } from '@peryl/utils/uuid';
import React from 'react';

/**
 * 渲染动态 React 代码的主入口函数
 *
 * 该函数负责将字符串形式的 React 组件代码转换为可执行的 React 组件。
 * 整个流程包括：代码转译、依赖解析、模块执行三个主要步骤。
 *
 * @param code - 需要渲染的 React 组件代码字符串（支持 JSX/TSX 语法）
 * @param getResource - 资源加载器函数，用于异步获取外部依赖模块（如 react、babel 等）
 *
 * @returns Promise，返回三种可能的结果：
 *   - { status: "resolved", Component }: 成功转换，Component 为可渲染的 React 组件函数
 *   - { status: "rejected", error }: 转换失败，error 包含具体的错误信息
 *   - { status: "empty" }: 输入代码为空，无需渲染
 *
 * @example
 * const result = await renderReactCode({
 *   code: 'export default function MyComponent() { return <div>Hello</div>; }',
 *   getResource: (name) => import(name)
 * });
 * if (result.status === "resolved") {
 *   return <result.Component />;
 * }
 */
export async function renderReactCode(
  {
    code,
    getResource,
  }: {
    code: string,
    getResource: (name: string) => Promise<any>,
  },
): Promise<{
  status: "resolved",
  Component: (props: any) => React.ReactElement
} | {
  status: "rejected",
  error: any
} | { status: "empty" }> {
  try {
    // 并行执行代码转换和 React 模块加载
    // _Component: 转换后的组件函数，如果 code 为空则为 null
    // getResource("react"): 预加载 React 核心库供后续使用
    let [_Component /*ReactDOM,*/ /*React*/] = await Promise.all([
      !code ? null : transformCode({ code, getResource }),
      // getResource('react-dom'),
      getResource("react"),
    ]);

    // 如果没有代码或转换失败，返回空状态
    if (!_Component) {return { status: "empty" };}

    // 返回成功状态及可执行的组件函数
    return {
      status: "resolved",
      Component: _Component,
    };
  } catch (e) {
    console.error(e);
    // 捕获所有异常并返回拒绝状态，便于调用方统一处理错误
    return {
      status: "rejected",
      error: e,
    };
  }
}

/**
 * 将 TypeScript/JSX 代码转译为标准 JavaScript 代码
 *
 * 使用 Babel 编译器对源代码进行转译，支持以下特性：
 * - TypeScript 语法（包括类型注解、接口等）
 * - JSX/TSX 语法
 * - ES6+ 现代 JavaScript 特性
 * - Fragment 简写语法 <>...</>
 *
 * @param code - 待转译的原始代码字符串
 * @param getResource - 资源加载器，用于获取 Babel 编译器和 React 模块
 *
 * @returns 转译后的纯 JavaScript 代码字符串
 *
 * @note 转译配置说明：
 * - "env" preset: 将现代 JS 语法转换为兼容性更好的语法
 * - "typescript" preset: 移除类型注解，保留运行时逻辑
 * - "react" preset: 将 JSX 转换为 React.createElement 调用
 */
export async function transpileCode(
  {
    code,
    getResource,
  }: {
    code: string,
    getResource: (name: string) => Promise<any>
  },
) {
  // 加载 Babel 编译器（React 模块在此处主要用于确保环境就绪）
  const [Babel /*React*/] = await Promise.all([
    getResource("babel"),
    getResource("react"),
  ]);

  // 预处理：将 JSX Fragment 简写语法 <>...</> 替换为标准写法 <React.Fragment>...</React.Fragment>
  // 这样可以避免某些边界情况下的解析问题
  code = code.replace(/<>/g, "<React.Fragment>").replace(/<\/>/g, "</React.Fragment>");

  // 使用 Babel 进行代码转译
  const output = Babel.transform(code, {
    filename: `${uuid()}.tsx`, // 生成唯一文件名，帮助 Babel 识别文件类型为 TSX
    presets: [
      // env preset: 处理 ES6+ 语法转换
      "env",
      [
        // TypeScript preset: 处理 TypeScript 语法
        "typescript",
        {
          isTSX: true,                // 启用 TSX 支持，允许在 TypeScript 中使用 JSX
          allExtensions: true,        // 对所有文件扩展名都应用 TSX 转换规则
          jsxPragma: "React",         // 指定 JSX 转换时使用的全局变量名（旧版 React 需要）
          allowNamespaces: true,      // 允许 XML 命名空间语法（如 <my:component>）
          allowDeclareFields: true,   // 支持 TypeScript 声明字段语法（如 field!: string）
          onlyRemoveTypeImports: true, // 仅移除类型导入语句，保留值导入（优化打包体积）
        },
      ],
      [
        // React preset: 处理 JSX 语法转换
        "react",
        {
          throwIfNamespace: false,     // 禁用命名空间检查，允许非标准的 JSX 命名空间用法
        },
      ],
    ],
  }).code;

  return output;
}

/**
 * 完整的代码转换流程：从源代码到可执行组件
 *
 * 这是核心的转换函数，串联了以下步骤：
 * 1. 加载 React 模块
 * 2. 转译 TypeScript/JSX 代码为标准 JavaScript
 * 3. 分析并构建依赖关系
 * 4. 在沙箱环境中执行代码并导出组件
 *
 * @param code - 原始的 React 组件代码字符串
 * @param getResource - 资源加载器，用于获取所有需要的依赖模块
 *
 * @returns 导出的默认组件函数，如果执行失败则返回 null
 *
 * @throws 可能在依赖加载或代码执行时抛出异常
 */
export async function transformCode(
  {
    code,
    getResource,
  }: {
    code: string,
    getResource: (name: string) => Promise<any>
  },
) {

  // 第一步：加载 React 核心模块，供后续代码执行时使用
  const React = await getResource("react");

  // 第二步：将 TypeScript/JSX 代码转译为标准 JavaScript
  const output = await transpileCode({ code, getResource });
  // console.log(output);

  // 第三步：分析转译后代码中的 require() 调用，构建依赖映射表
  const require = await buildDependency(output, getResource);

  // 第四步：创建沙箱执行环境
  // 使用 new Function 创建一个隔离的执行上下文，传入以下参数：
  // - module: CommonJS 模块对象
  // - exports: 模块导出对象
  // - require: 自定义的依赖加载函数
  // - React: React 核心库
  // eslint-disable-next-line no-new-func
  const fn = new Function("module,exports,require,React", output);

  // 初始化 CommonJS 模块结构
  const module = { exports: {} as any };

  try {
    // 在沙箱中执行转译后的代码
    // call 方法确保 this 指向正确，并传入所有必需的参数
    fn.call(module, module, module.exports, require, React);
  } catch (e) {
    console.error(e);
    // 执行失败时返回 null，由上层函数处理错误状态
    return null;
  }

  // 返回通过 export default 导出的组件函数
  return module.exports.default;
}

/**
 * 构建代码依赖关系映射
 *
 * 该函数通过正则表达式分析转译后的代码，提取所有 require() 调用，
 * 然后异步加载这些依赖并构建一个查找表，最后返回一个 require 函数供代码执行时使用。
 *
 * @param output - 已转译的 JavaScript 代码字符串
 * @param getResource - 资源加载器，用于异步获取各个依赖模块
 *
 * @returns 一个 require 函数，接收模块名称并返回对应的模块实例
 *
 * @example
 * // 假设代码中包含: const React = require('react');
 * // buildDependency 会提取 'react' 并加载它
 * // 返回的 require 函数可以这样使用: require('react') -> React 模块
 *
 * @throws 如果任何依赖加载失败，会抛出异常
 */
export async function buildDependency(output: string, getResource: (name: string) => Promise<any>): Promise<((name: string) => any)> {
  // 存储所有需要加载的依赖模块名称
  let names: string[] = [];

  // 正则表达式匹配所有的 require('module-name') 或 require("module-name") 调用
  const regexp = /require\(['"](.*)['"]\)/g;

  // 遍历所有匹配项，收集模块名称
  let match = regexp.exec(output);
  while (!!match) {
    names.push(match[1]); // match[1] 是捕获组中的模块名称
    match = regexp.exec(output);
  }

  try {
    // 并行加载所有依赖模块，提高加载效率
    const dependencies = (await Promise.all(names.map(async name => {
      return {
        name,                          // 模块名称（作为键）
        module: await getResource(name), // 模块实例（作为值）
      };
    }))).reduce((prev, { name, module }) => {
      // 将模块数组转换为对象映射表 { 'react': React模块, 'lodash': lodash模块, ... }
      prev[name] = module;
      return prev;
    }, {} as Record<string, any>);

    // 返回一个闭包函数，模拟 CommonJS 的 require 行为
    // 当代码中调用 require('react') 时，会从 dependencies 中查找并返回对应模块
    return (name: string) => {
      return dependencies[name];
    };
  } catch (e) {
    console.error(e);
    // 依赖加载失败时抛出异常，中断整个转换流程
    throw e;
  }
}

