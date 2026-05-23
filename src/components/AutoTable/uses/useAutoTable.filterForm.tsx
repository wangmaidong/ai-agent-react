import type { iAutoTable } from "../useAutoTable.utils.tsx";
import { useMemo, useState } from "react";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";
import { Button, Col, Form, Input, Row, Space, Tooltip } from "antd";
import chunk from "lodash/chunk";
import { BugOutlined, FileSearchOutlined } from "@ant-design/icons";

export function useAutoTableFilterForm(autoTable: iAutoTable) {

  // 维护一个变量控制是否渲染查询表单
  const [isShowFilterForm, setIsShowFilterForm] = useState(false);
  const [testCount, setTestCount] = useState(100);

  const bodyRenderMeta = useMemo((): iRenderMeta | null => {
    if (!isShowFilterForm) {
      return null;
    }
    const colNum: number = 3;
    const filterOptions: ({ title: string, dataIndex: string } | null)[] = [
      { title: "用户名:" + testCount, dataIndex: "username" },
      { title: "用户昵称", dataIndex: "fullName" },
      { title: "手机号码", dataIndex: "phoneNumber" },
      { title: "身份证号码", dataIndex: "idCard" },
    ];
    if (colNum != 1) {
      const emptyNum = filterOptions.length % colNum;
      if (emptyNum) {
        filterOptions.push(...new Array(emptyNum).fill(null));
      }
    }
    return {
      key: "filterForm",
      seq: 1,
      content: (
        <Form>
          <Space vertical style={{ width: "100%" }}>
            {chunk(filterOptions, colNum).map((group, groupIndex) => (
              <Row gutter={12} key={groupIndex} style={{ display: "flex", alignItems: "center" }}>
                {group.map((item, itemIndex) => (
                  <Col span={24 / colNum} style={{ display: "flex", alignItems: "center" }} key={itemIndex}>
                    {!item ? null : (
                      <>
                        <span style={{ width: "150px", textAlignLast: "justify" }}>{item.title}：</span>
                        <Form.Item label={item.title} name={item.dataIndex} noStyle>
                          <Input placeholder={item.title} />
                        </Form.Item>
                      </>
                    )}
                  </Col>
                ))}
              </Row>
            ))}
          </Space>
        </Form>
      ),
    };
  }, [isShowFilterForm, testCount]);

  autoTable.hooks.bodyRender.use(bodyRenderMeta);

  // 用来展开，收起查询表单的按钮
  const searchRenderMeta = useMemo((): iRenderMeta => ({
    key: "filterFormButton",
    seq: 2,
    content: <>
      <Tooltip title="展开/收起查询表单">
        <Button icon={<FileSearchOutlined />} onClick={() => setIsShowFilterForm(prev => !prev)} />
      </Tooltip>
      <Tooltip title="测试查询表单">
        <Button icon={<BugOutlined />} onClick={() => setTestCount(prev => prev + 1)} />
      </Tooltip>
    </>,
  }), []);

  autoTable.hooks.searchRender.use(searchRenderMeta);

  return {
    filterForm: {},
  };
}

declare module "../useAutoTable.utils.tsx" {
  export interface iAutoTable {
    filterForm: ReturnType<typeof useAutoTableFilterForm>["filterForm"];
  }
}
