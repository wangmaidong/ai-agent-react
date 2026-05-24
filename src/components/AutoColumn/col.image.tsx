import type { iAutoColumnMapper } from "./AutoColumn.utils.tsx";
import { Image } from "antd";
import { CreateDefaultColumnConfig } from "./CreateDefaultColumnConfig.tsx";
import { pathJoin } from "@peryl/utils/pathJoin";
import { PUBLIC_PATH } from "../../AppService/env.ts";
import { ImageEditor } from "../ImageEditor/ImageEditor.tsx";

declare module "./AutoColumn.utils.tsx" {
  interface iAutoColumnExpander {image: {};}
}

export type iAutoColumnImage = iAutoColumnMapper["image"]

export function installColumnImage() {
  CreateDefaultColumnConfig.image = (col) => {
    return {
      width: "100px",
      inlineRender: ({ value }) => (
        !value ? null : <Image src={pathJoin(PUBLIC_PATH, value)} style={{ height: "40px", width: "auto", borderRadius: "4px" }} />
      ),
      inlineEditor: ({ form, dataIndex, rules, formData }) => (
        <ImageEditor
          value={formData[dataIndex]}
          onChange={filePath => form.setFieldValue(dataIndex, filePath)}
        />
      ),
      ...col,
    };
  };
}
