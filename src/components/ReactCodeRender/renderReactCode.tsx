import { uuid } from '@peryl/utils/uuid';
import React from 'react';

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

    let [_Component /*ReactDOM,*/ /*React*/] = await Promise.all([
      !code ? null : transformCode({ code, getResource }),
      // getResource('react-dom'),
      getResource("react"),
    ]);

    if (!_Component) {return { status: "empty" };}

    return {
      status: "resolved",
      Component: _Component,
    };
  } catch (e) {
    console.error(e);
    return {
      status: "rejected",
      error: e,
    };
  }
}

export async function transpileCode(
  {
    code,
    getResource,
  }: {
    code: string,
    getResource: (name: string) => Promise<any>
  },
) {
  const [Babel /*React*/] = await Promise.all([
    getResource("babel"),
    getResource("react"),
  ]);
  code = code.replace(/<>/g, "<React.Fragment>").replace(/<\/>/g, "</React.Fragment>");

  const output = Babel.transform(code, {
    filename: `${uuid()}.tsx`,
    presets: [
      "env",
      [
        "typescript",
        {
          isTSX: true,                // 启用 TSX 支持
          allExtensions: true,        // 支持所有文件扩展名的 TSX
          jsxPragma: "React",         // JSX 转换的前缀（旧版）
          allowNamespaces: true,      // 支持命名空间语法
          allowDeclareFields: true,   // 支持声明字段语法
          onlyRemoveTypeImports: true, // 仅移除类型导入语句
        },
      ],
      [
        "react",
        {
          throwIfNamespace: false,     // 禁用命名空间检查
        },
      ],
    ],
  }).code;
  return output;
}

export async function transformCode(
  {
    code,
    getResource,
  }: {
    code: string,
    getResource: (name: string) => Promise<any>
  },
) {

  const React = await getResource("react");
  const output = await transpileCode({ code, getResource });
  // console.log(output);

  const require = await buildDependency(output, getResource);

  // eslint-disable-next-line no-new-func
  const fn = new Function("module,exports,require,React", output);
  const module = { exports: {} as any };
  try {
    fn.call(module, module, module.exports, require, React);
  } catch (e) {
    console.error(e);
    return null;
  }
  return module.exports.default;
}

export async function buildDependency(output: string, getResource: (name: string) => Promise<any>): Promise<((name: string) => any)> {
  let names: string[] = [];
  const regexp = /require\(['"](.*)['"]\)/g;
  let match = regexp.exec(output);
  while (!!match) {
    names.push(match[1]);
    match = regexp.exec(output);
  }
  try {
    const dependencies = (await Promise.all(names.map(async name => {
      return {
        name,
        module: await getResource(name),
      };
    }))).reduce((prev, { name, module }) => {
      prev[name] = module;
      return prev;
    }, {} as Record<string, any>);
    return (name: string) => {
      return dependencies[name];
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}
