import { useEffect, useState } from "react";
import { createEffects } from "@peryl/utils/createEffects";
import { useStableCallback } from "../../uses/useStableCallback";
import { Alert } from "antd";
import { PlainObject } from "@peryl/utils/event";
import { getErrorMessage, showError } from "../../utils/showError";
import { renderReactCode } from "./renderReactCode";
import { LibraryLoader } from "../../utils/LibraryLoader";
import { SafeRender } from "../SafeRender/SafeRender";
import { RuntimeErrorDisplay } from "../SafeRender/RuntimeErrorDisplay";

export const ReactCodeRender = (
  props: {
    code?: string
    attrs?: PlainObject
  },
) => {

  const [effects] = useState(() => createEffects().effects);
  const [Component, setComponent] = useState(null as null | ((props: any) => any));

  const reload = useStableCallback(async () => {
    try {
      effects.clear();
      if (!!props.code?.trim().length) {
        const renderResult = await renderReactCode({ code: props.code, getResource: LibraryLoader.load });

        if (renderResult.status === "resolved") {
          setComponent(() => renderResult.Component);
        } else if (renderResult.status === "rejected") {
          const errorMsg = getErrorMessage(renderResult.error);
          setComponent(() => () => <Alert type="error" description={errorMsg} />);
        } else if (renderResult.status === "empty") {
          setComponent(() => () => <Alert type="info" description="暂无内容" />);
        }
        effects.push(() => {setComponent(null);});
      } else {
        setComponent(null);
      }
    } catch (e) {
      console.error(e);
      showError(e);
    }
  });
  useEffect(() => {
    reload();
    return () => effects.clear();
  }, [props.code, effects, reload]);

  if (!Component) {return null;}

  return (
    // 使用 SafeRender 包裹动态组件，拦截其内部产生的运行时异常
    <SafeRender
      key={props.code} // 当代码变化时，强制重置边界状态
      fallback={(error) => <RuntimeErrorDisplay error={error} />}
    >
      <Component {...props.attrs} />
    </SafeRender>
  );
};
