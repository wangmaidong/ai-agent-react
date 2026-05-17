import ReactDOM from "react-dom/client";
import { IndexApp } from "./layouts/routes";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "./styles/index.scss";
import { enableMockJs } from "./mock/mock";
import env from "./AppService/env";
import { installColumnImage } from "./packages/image/col.image.tsx";

installColumnImage();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      token: {
        fontFamily: "PingFang SC",
      },
    }}
  >
    {IndexApp}
  </ConfigProvider>,
);

env.enableMockApi && enableMockJs();
