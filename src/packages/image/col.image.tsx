import { Image, Input } from "antd";
import React from "react";
import type { iAutoColumnMapper } from "../../components/AutoColumn/AutoColumn.utils.tsx";
import { CreateDefaultColumnConfig } from "../../components/AutoColumn/CreateDefaultColumnConfig.tsx";
import { pathJoin } from "@peryl/utils/pathJoin";
import env from "../../AppService/env.ts";


declare module "../../components/AutoColumn/AutoColumn.utils.tsx" {
  export interface iAutoColumnExpander {
    image: { imgHeight: number, imgWidth?: number };
  }
}

export type iAutoColumnImage = iAutoColumnMapper["image"]

export function installColumnImage() {
  CreateDefaultColumnConfig.image = (col) => {
    return {
      ...col,
      width: "120px",
      imgWidth: 70,
      inlineRender: ({ value }) => <Image
        src={pathJoin(env.assetsPrefix, value)}
        height={col.imgHeight}
        width={col.imgWidth}
      />,
      inlineEditor: () => <Input />,
    };
  };
}
