import { Select } from "antd";

export const AIConfigs: { aiConfigName: string, aiConfigCode: string }[] = [
  { aiConfigName: "qwen3.6-plus", aiConfigCode: "bailian-qwen3.6-plus" },
  { aiConfigName: "doubao-vision", aiConfigCode: "huoshan-doubao-vision" },
  { aiConfigName: "doubao", aiConfigCode: "huoshan-doubao" },
];

export const AIConfigSelectOptions = AIConfigs.map((item) => (
  <Select.Option value={item.aiConfigCode} key={item.aiConfigCode}>{item.aiConfigName}</Select.Option>
));
