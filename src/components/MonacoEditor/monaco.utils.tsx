import { defer, DFD } from "@peryl/utils/defer";
import { PlainObject, SimpleFunction } from "@peryl/utils/event";
import { pathJoin } from "@peryl/utils/pathJoin";

interface iMonacoRequireFunction {
  (deps: string[], handler: (modules: any[]) => void): void,

  config: SimpleFunction
}

// const MONACO_LOADER_PATH = "https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.34.1/min/vs/loader.min.js";
// const MONACO_VS_PATH = "https://cdn.bootcdn.net/ajax/libs/monaco-editor/0.34.1/min/vs";

export const MonacoLoader = (() => {

  const MONACO_LOADER_PATH = pathJoin(__webpack_public_path__, "/libs/monaco-editor-0.55.1/min/vs/loader.js");
  const MONACO_VS_PATH = pathJoin(__webpack_public_path__, "/libs/monaco-editor-0.55.1/min/vs");

  /**
   * 加载monaco中的loader函数
   * @author  韦胜健
   * @date    2023/2/10 9:49
   */
  const getMonacoRequire = (() => {
    let monacoRequire = null as null | iMonacoRequireFunction;
    return async (): Promise<iMonacoRequireFunction> => {
      if (!!monacoRequire) {
        return monacoRequire;
      }
      return new Promise((resolve, reject) => {
        const scriptEl = document.createElement("script");
        const Win = window as any;
        scriptEl.onload = () => {
          monacoRequire = Win.require as any;

          /*---------------------------------------解决window.define函数被污染的关键: start-------------------------------------------*/
          const monacoDefine = Win.define as any;
          Win.define = ((...args: any[]) => monacoDefine!(...args));
          /*---------------------------------------解决window.define函数被污染的关键: end-------------------------------------------*/

          if (!!monacoRequire) {
            resolve(monacoRequire);
          } else {
            alert("加载monaco-editor/loader失败！");
            reject("window.require not exist!");
          }
        };
        scriptEl.onerror = (error) => {
          alert("加载monaco-editor/loader失败！");
          reject(error);
        };
        scriptEl.src = MONACO_LOADER_PATH;
        document.body.appendChild(scriptEl);
      });
    };
  })();

  let getMonacoDefer: DFD<PlainObject> | undefined = undefined;

  const getMonaco = () => {
    if (!getMonacoDefer) {
      getMonacoDefer = defer<PlainObject>();
      /**
       * 先加载babel相关的依赖再去加载monaco，不然babel后加载的话好像会编译monaco的代码导致报错
       */
      getMonacoRequire().then(monacoRequire => {
        monacoRequire.config({ paths: { vs: MONACO_VS_PATH } });
        monacoRequire([
          "vs/editor/editor.main",
        ], (monaco: any) => {
          if (!!monaco) {
            // --- 新增：禁用 TypeScript 验证和诊断 ---
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true, // 禁用语义检查（变量未定义、类型不匹配等）
              noSyntaxValidation: true,   // 禁用语法检查（括号不匹配等，可选）
              noSuggestionDiagnostics: true, // 禁用建议诊断
            });

            // 也可以针对 JavaScript 生效（如果以后会用到 JS）
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: true,
            });
            getMonacoDefer!.resolve(monaco);
          } else {
            alert("load monaco failed!");
            getMonacoDefer!.reject("load monaco failed!");
          }
        });
      });
    }
    return getMonacoDefer.promise;
  };

  return { getMonaco };
})();