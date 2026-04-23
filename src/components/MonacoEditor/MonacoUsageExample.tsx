import { useState } from "react";
import { DEMO_CODE } from "./DEMO_CODE";
import { Col, Row } from "antd";
import { MonacoEditor } from "./MonacoEditor";

export const MonacoUsageExample = () => {

  const [sourceCode, setSourceCode] = useState(DEMO_CODE);

  return (
    <div>
      <Row gutter={20}>
        <Col span={12}>
          <div style={{ height: "700px" }}>
            <MonacoEditor language="typescript" value={sourceCode} onChange={setSourceCode} />
          </div>
        </Col>
        <Col span={12}>
          <div style={{ height: "700px" }}>
            <MonacoEditor language="typescript" value={sourceCode} onChange={setSourceCode} />
          </div>
        </Col>
      </Row>

    </div>
  );
};