import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Alert, notification } from "antd";
import PageSpin from "../PageSpin";

export const DynamicPage = (props: { dirname: string }) => {

  const params = useParams();
  // console.log('dynamic route params', params);

  const routeName: string = [params.name, params["*"]].filter(i => !!i?.trim().length).join("/");

  // console.log({ routeName });

  const [Component, setComponent] = useState(null as null | ((props: any) => any));

  useEffect(() => {
    if (!!routeName) {
      // console.log(`dynamic page: ${routeName}`);
      (async () => {
        try {
          const modules = modulesMap[props.dirname];
          if (!modules) {
            throw new Error(`无效的目录名: ${props.dirname}`);
          }

          const path = `../../${props.dirname}/${routeName}-page`;
          let PageComponent = null as any;

          console.log({ modulesMap });

          for (const ext of pageExtensions) {
            const modulePath = `${path}${ext}`;
            if (modules[modulePath]) {
              const val = await modules[modulePath]();
              console.log(val);
              PageComponent = await (modules[modulePath]().then((val: any) => val.default));
              break;
            }
          }
          if (!PageComponent) {
            notification.error({ message: "Missing export default in page." });
          }
          setComponent(() => PageComponent);
        } catch (e) {
          console.error(e);
          setComponent(() => {
            return () => (
              <div style={{ padding: "1em" }}>
                <Alert type="error" message={`页面"${routeName}"不存在`} />
              </div>
            );
          });
        }
      })();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComponent(() => {
        return () => (
          <div style={{ padding: "1em" }}>
            <Alert type="error" message={`缺少动态路由参数！}`} />
          </div>
        );
      });
    }
  }, [routeName, props.dirname]);

  return !Component ? <PageSpin /> : <Component {...props as any} />;
};

const modulesMap: Record<string, any> = {
  pages: import.meta.glob("../../pages/**/*-page.*", { eager: false }),
  private: import.meta.glob("../../private/**/*-page.*", { eager: false }),
  public: import.meta.glob("../../public/**/*-page.*", { eager: false }),
};

const pageExtensions = [".vue", ".tsx", ".ts", ".jsx", ".js"];
