import { Alert, Typography } from "antd";
import styled from "@emotion/styled";

const ErrorWrapper = styled.div`
  padding: 16px;
  border: 1px dashed #ff4d4f;
  background: #fff2f0;
  border-radius: 8px;
`;

export const RuntimeErrorDisplay = ({ error }: { error: Error }) => (
  <ErrorWrapper>
    <Alert
      title="代码运行时错误"
      description={
        <Typography.Paragraph ellipsis={{ rows: 3, expandable: true, symbol: "展开详情" }}>
          {error?.message || "未知运行错误"}
        </Typography.Paragraph>
      }
      type="error"
      showIcon
    />
  </ErrorWrapper>
);
