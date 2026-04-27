import React from 'react';
import { iResumeTemplateRecord } from './resume.utils';
import { useMounted } from '../../uses/useMounted';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { CardList } from '../../components/CardList/CardList';
import { Button, Popconfirm } from 'antd';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import FileAddOutlined from '@ant-design/icons/FileAddOutlined';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
import PlusSquareOutlined from '@ant-design/icons/PlusSquareOutlined';
import { notFinish } from '../../utils/notFinish';
import { LoadingCover } from '../../components/LoadingCover/LoadingCover';
import { MonacoLoader } from '../../components/MonacoEditor/monaco.utils';
import { useListPage } from '../../uses/useListPage';

export default function ResumeTemplateListPage() {
  const { recordList, reloadData, isLoading, editRecord, createRecord, deleteRecord, copyRecord } =
    useListPage<iResumeTemplateRecord>({
      module: 'llm_resume_template',
      detailPath: '/pages/resume/template/detail',
      autoReload: false,
    });

  useMounted(async () => {
    // 先加载Monaco
    MonacoLoader.getMonaco();
    reloadData();
  });

  const renderList: ((() => React.ReactElement) | iResumeTemplateRecord)[] = [
    () => (
      <div className="card-list-operation">
        <div className="card-list-operation-title">创建简历模板</div>
        <div className="card-list-operation-item" onClick={createRecord}>
          <FileAddOutlined />
          <span>创建简历模板</span>
        </div>
        <div className="card-list-operation-item" onClick={notFinish}>
          <CloudUploadOutlined />
          <span>导入模板文件</span>
        </div>
        <div className="card-list-operation-item" onClick={notFinish}>
          <PlusSquareOutlined />
          <span>导入模板数据</span>
        </div>
      </div>
    ),
    ...recordList,
  ];

  return (
    <PageContainer>
      {isLoading && <LoadingCover />}
      <CardList
        data={renderList}
        cover={(item) => (
          <div className="card-list-cover">
            <Button type="primary" onClick={() => editRecord(item)}>
              编辑模板
            </Button>
            <Popconfirm title="确定删除？" onConfirm={() => deleteRecord(item)}>
              <Button danger type="primary" className="card-list-cover-deleter">
                <CloseOutlined />
              </Button>
            </Popconfirm>
            <Popconfirm title="确定复制？" onConfirm={() => copyRecord(item)}>
              <span>复制模板</span>
            </Popconfirm>
          </div>
        )}
      />
    </PageContainer>
  );
};
