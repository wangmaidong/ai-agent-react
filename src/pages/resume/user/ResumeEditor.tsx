import React from "react";
import { Button, Card, Col, Form, Input, Row } from "antd";
import styled from "@emotion/styled";
import MultiLineTextarea from "../../../components/MultiLineTextarea/MultiLineTextarea";

// 样式定义
const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 0;

  .single-row {
    .ant-col {
      .ant-form-item:first-child:last-child {
        margin-bottom: 0;
      }
    }
  }
`;

const StyledCard = styled(Card)`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  .ant-card-head {
    background-color: #fafafa;
    border-bottom: 1px solid #f0f0f0;
  }
`;

const ListItemBox = styled.div`
  position: relative;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fff;

  &:hover {
    border-color: #4096ff;
  }
`;

// const IconInputWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   i {
//     font-size: 1.2rem;
//     color: #666;
//   }
// `;

interface ResumeEditorProps {
  form: any; // FormInstance
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ form }) => {
  return (
    <SectionContainer>
      {/* 1. 基础配置：标题与主题色 */}
      <StyledCard title={<span><i className="bi bi-gear-fill" style={{ marginRight: 8 }} />核心样式配置</span>}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name={["resumeJsonData", "title"]} label="简历标题" rules={[{ required: true }]}>
              <Input placeholder="例如：某某某的个人简历" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={["resumeJsonData", "avatar"]} label="头像地址">
              <Input placeholder="请输入职业照图片 URL" prefix={<i className="bi bi-person-bounding-box" />} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={["resumeJsonData", "primary"]} label="第一主题色">
              <Input placeholder="#十六进制" suffix={<i className="bi bi-palette" />} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={["resumeJsonData", "secondary"]} label="第二主题色">
              <Input placeholder="#十六进制" />
            </Form.Item>
          </Col>
        </Row>
      </StyledCard>

      {/* 2. 基本信息项 (Basic Information) */}
      <StyledCard title={<span><i className="bi bi-person-lines-fill" style={{ marginRight: 8 }} />基本信息项</span>}>
        <Form.Item name={["resumeJsonData", "basic", "title"]} label="板块标题">
          <Input placeholder="示例：联系方式" />
        </Form.Item>
        <Form.List name={["resumeJsonData", "basic", "data"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <ListItemBox key={key}>
                  <Row gutter={8} align="middle" className="single-row">
                    <Col span={7}>
                      <Form.Item {...restField} name={[name, "label"]} label="标签" rules={[{ required: true }]}>
                        <Input placeholder="电话/邮箱/工作年限" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...restField} name={[name, "val"]} label="内容">
                        <Input placeholder="请输入对应信息" />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item {...restField} name={[name, "icon"]} label="图标类名">
                        <Input placeholder="bi-telephone" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button type="text" danger onClick={() => remove(name)} icon={<i className="bi bi-x-circle-fill"></i>} />
                    </Col>
                  </Row>
                </ListItemBox>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<i className="bi bi-plus-lg" />}>添加基本信息</Button>
            </>
          )}
        </Form.List>
      </StyledCard>

      {/* 3. 教育信息 (Education) */}
      <StyledCard title={<span><i className="bi bi-mortarboard-fill" style={{ marginRight: 8 }} />教育背景</span>}>
        <Form.Item name={["resumeJsonData", "education", "title"]} label="板块标题">
          <Input placeholder="示例：教育经历" />
        </Form.Item>
        <Form.List name={["resumeJsonData", "education", "data"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <ListItemBox key={key}>
                  <Row gutter={12}>
                    <Col span={8}><Form.Item {...restField} name={[name, "time"]} label="时间范围"><Input placeholder="2019-07 ~ 2023-06" /></Form.Item></Col>
                    <Col span={8}><Form.Item {...restField} name={[name, "school"]} label="学校"><Input placeholder="中山大学" /></Form.Item></Col>
                    <Col span={8}><Form.Item {...restField} name={[name, "program"]} label="专业/学历"><Input placeholder="计算机科学(本科)" /></Form.Item></Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, "content"]} label="详情 (一行一条内容)">
                        <MultiLineTextarea placeholder="支持按行输入专业课或成绩" autoSize={{ minRows: 2 }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button size="small" type="link" danger onClick={() => remove(name)} style={{ position: "absolute", right: "-4px", top: "-2px" }}>
                    <i className="bi bi-x-circle-fill"></i>
                  </Button>
                </ListItemBox>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<i className="bi bi-plus-lg" />}>添加教育经历</Button>
            </>
          )}
        </Form.List>
      </StyledCard>

      {/* 4. 工作经历 (Experience) */}
      <StyledCard title={<span><i className="bi bi-briefcase-fill" style={{ marginRight: 8 }} />工作/实习经历</span>}>
        <Form.Item name={["resumeJsonData", "experience", "title"]} label="板块标题">
          <Input placeholder="示例：工作经历" />
        </Form.Item>
        <Form.List name={["resumeJsonData", "experience", "data"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <ListItemBox key={key}>
                  <Row gutter={12}>
                    <Col span={8}><Form.Item {...restField} name={[name, "time"]} label="时间段"><Input placeholder="2022-03 ~ 至今" /></Form.Item></Col>
                    <Col span={8}><Form.Item {...restField} name={[name, "company"]} label="公司名称"><Input placeholder="某某科技有限公司" /></Form.Item></Col>
                    <Col span={8}><Form.Item {...restField} name={[name, "role"]} label="职位角色"><Input placeholder="前端开发工程师" /></Form.Item></Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, "content"]} label="工作详情 (一行一条内容)">
                        <MultiLineTextarea placeholder="1. 负责...&#10;2. 优化..." autoSize={{ minRows: 3 }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button size="small" type="link" danger onClick={() => remove(name)} style={{ position: "absolute", right: "-4px", top: "-2px" }}>
                    <i className="bi bi-x-circle-fill"></i>
                  </Button>
                </ListItemBox>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<i className="bi bi-plus-lg" />}>添加工作经历</Button>
            </>
          )}
        </Form.List>
      </StyledCard>

      {/* 5. 额外板块 (Externals) */}
      <StyledCard title={<span><i className="bi bi-grid-3x3-gap-fill" style={{ marginRight: 8 }} />其他信息 (技能/自我评价等)</span>}>
        <Form.List name={["resumeJsonData", "externals"]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <ListItemBox key={key}>
                  <Form.Item {...restField} name={[name, "title"]} label="信息标题" rules={[{ required: true }]}>
                    <Input placeholder="技能特长 / 兴趣爱好" />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, "content"]} label="详细描述 (按行输入)">
                    <MultiLineTextarea autoSize={{ minRows: 2 }} />
                  </Form.Item>
                  <Button size="small" type="link" danger onClick={() => remove(name)} style={{ position: "absolute", right: "-4px", top: "-2px" }}>
                    <i className="bi bi-x-circle-fill"></i>
                  </Button>
                </ListItemBox>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<i className="bi bi-plus-lg" />}>添加新板块</Button>
            </>
          )}
        </Form.List>
      </StyledCard>
    </SectionContainer>
  );
};

export default ResumeEditor;
