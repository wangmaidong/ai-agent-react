import { PageContainer } from "../../components/PageContainer/PageContainer.tsx";
import { Button, Card } from "antd";
import { type iSingleFilterInstance, SingleFilter } from "../../components/AutoFilter/SingleFilter.tsx";
import { useCallback, useMemo, useRef, useState } from "react";
import type { iAutoColumn } from "../../components/AutoColumn/AutoColumn.utils.tsx";
import { type iMultipleFilterInstance, MultipleFilter } from "../../components/AutoFilter/MultipleFilter.tsx";
import { fillWithDefaultColumn } from "../../components/AutoColumn/CreateDefaultColumnConfig.tsx";

export default function Page() {

  const [columns] = useState((): iAutoColumn[] => [
    { type: "input", title: "名称", dataIndex: "normalText", required: true },
    { type: "number", title: "数字", dataIndex: "numberVal" },
    { type: "number", title: "整数", dataIndex: "count" },
    { type: "select", title: "选项值", dataIndex: "selectVal", options: [{ label: "潜在客户", value: "potential" }, { label: "门店", value: "store" }, { label: "消费者", value: "consumer" }] },
    { type: "date", title: "日期", dataIndex: "dateVal" },
    { type: "datetime", title: "日期时间", dataIndex: "createdAt" },
  ]);

  const fillColumns = useMemo(() => columns.map(col => fillWithDefaultColumn(col)), [columns]);

  const filterOptionList = useMemo(() => fillColumns.map(i => i.filterOption).filter(i => i != null), [fillColumns]);

  const singleFilterRef = useRef<iSingleFilterInstance | null>(null);

  const getSingleFilterData = useCallback(async () => {
    const { queryParam: newQueryParam, filterTip } = (await singleFilterRef.current?.getFilterData()) ?? {};
    console.log(newQueryParam, filterTip);
  }, []);

  const multiFilterRef = useRef<iMultipleFilterInstance | null>(null);

  const getMultiFilterData = useCallback(async () => {
    const { queryParam: newQueryParam, filterTipList } = (await multiFilterRef.current?.getFilterData()) ?? {};
    console.log(newQueryParam, filterTipList);
  }, []);

  return (
    <PageContainer>
      <Card title="单字段筛选">
        <SingleFilter
          ref={singleFilterRef}
          filterOptionList={filterOptionList}
          defaultSearchField={"count"}
          // onSearch={async () => {await reload();}}
        />
        <br />
        <br />
        <Button type="primary" onClick={getSingleFilterData}>获取查询数据</Button>
      </Card>
      <Card title="多字段筛选" style={{ marginTop: "24px" }}>
        <MultipleFilter
          ref={multiFilterRef}
          filterOptionList={filterOptionList}
        />
        <br />
        <br />
        <Button type="primary" onClick={getMultiFilterData}>获取查询数据</Button>
      </Card>
    </PageContainer>
  );
}
