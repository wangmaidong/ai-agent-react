import { useDetailPage } from '../../../uses/useDetailPage';
import { iResumeUserRecord, ResumeTempViewMode, ResumeUserViewMode } from '../resume.utils';
import { useRef, useState } from 'react';
import { ResumeTemplateDefaultData } from './ResumeTemplateDefaultData';
import { cloneDeep } from 'lodash';
import { Button, Card, Form, Input, Modal, notification, Segmented, Space } from 'antd';
import { PageContainer } from '../../../components/PageContainer/PageContainer';
import { LoadingCover } from '../../../components/LoadingCover/LoadingCover';
import { router } from '../../../layouts/routes';
import { useStableCallback } from '../../../uses/useStableCallback';
import FixContainer from '../../../components/FixContainer/FixContainer';
import ResumeChatCopilot, { iResumeChatCopilotInstance } from '../template/ResumeChatCopilot';
import { MonacoEditor } from '../../../components/MonacoEditor/MonacoEditor';
import ColorButton from '../../../components/ColorButton';
import { useSnapshot } from '../../../uses/useSnapshot';
import { showError } from '../../../utils/showError';
import { modifyResumeUserSystemPrompt } from './modifyResumeUserSystemPrompt';
import { delay } from '@peryl/utils/delay';
import { useResumeTemplateSelector } from '../template/useResumeTemplateSelector';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import OptionButton, { iDropdownOption } from '../../../components/OptionButton';
import { pathJoin } from '@peryl/utils/pathJoin';
import env from '../../../AppService/env';
import { exportElement2Pdf } from '../../../utils/exportElement2Pdf';
import { useUploadService } from '../../../uses/useUploadService';
import { chooseImage } from '../../../utils/FileService';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
import ResumeEditor from './ResumeEditor';
import { useBufferStringHandler } from './useBufferStringHandler';
import { ReactCodeRender } from '../../../components/ReactCodeRender/ReactCodeRender';
import PageSpin from '../../../components/PageSpin';
import { doNothing } from '@peryl/utils/doNothing';

export default function ResumeUserDetailPage() {
  const {
    isLoading,
    saveType,
    form,
    save,
    id,
    setIsLoading,
    hasInit,
    record: detailRecord,
  } = useDetailPage<Partial<iResumeUserRecord>>({
    module: 'llm_resume_user',
    getNewRecord: () => cloneDeep(ResumeTemplateDefaultData),
    onAfterReload: (record, saveType) => {
      record.resumeJsonData = JSON.parse(
        record.resumeJsonString ?? ResumeTemplateDefaultData.resumeJsonString
      );
    },
  });

  const [viewMode, setViewMode] = useState<typeof ResumeUserViewMode.TYPES>(
    ResumeUserViewMode.preview
  );

  /*拿到所有的表单数据*/
  const formData: iResumeUserRecord = Form.useWatch(null, form) ?? {};
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  /*用来生成快照预览图的dom对象引用*/
  const snapshotElementRef = useRef(null as null | HTMLDivElement);

  /*---------------------------------------保存简历数据-------------------------------------------*/
  const { getSnapshot } = useSnapshot();
  const saveDetail = useStableCallback(async () => {
    setIsLoading(true);
    if (viewMode !== ResumeTempViewMode.preview) {
      setViewMode(ResumeTempViewMode.preview);
      /*等待简历渲染完毕*/
      await delay(300);
    }
    /*生成简历预览图*/
    const thumbImagePath = await getSnapshot({
      el: snapshotElementRef.current!.firstElementChild as any,
      compress: true,
    });
    try {
      await save({
        ...formDataRef.current,
        id: id,
        thumbImage: thumbImagePath,
        resumeJsonString: JSON.stringify(formDataRef.current.resumeJsonData),
      } satisfies Partial<iResumeUserRecord>);
    } catch (e) {
      showError(e);
    } finally {
      setIsLoading(false);
    }
  });

  const reset = useStableCallback(async () => {
    form.setFieldValue('sourceCode', detailRecord.sourceCode);
    // form.setFieldValue("resumeJsonData", detailRecord.resumeJsonData);
  });

  /*系统提示词*/
  const systemPrompt = useStableCallback(() =>
    modifyResumeUserSystemPrompt(formData.sourceCode ?? '', formData.resumeJsonData)
  );

  /*---------------------------------------处理AI的结果消息，主要是检测是否需要更新组件代码-------------------------------------------*/
  const handleAiMessage = useStableCallback((message: string, question: string) => {
    bufferStringHandler.onFinish();
    const startTag = '/*---CodeStart---*/';
    const endTag = '/*---CodeEnd---*/';
    try {
      if (message.indexOf(endTag) > -1) {
        const startIndex = message.indexOf(startTag);
        const endIndex = message.indexOf(endTag);
        let code = message.substring(startIndex + startTag.length, endIndex).trim();
        if (code.startsWith('```tsx')) {
          const lastIndex = code.lastIndexOf('```');
          code = code.substring(7, lastIndex);
        }
        console.log(code);
        form.setFieldValue('sourceCode', code);
      }
    } catch (e) {
      showError(e);
    }
  });

  /*---------------------------------------选择模板-------------------------------------------*/
  const templateSelector = useResumeTemplateSelector();
  const selectTemplate = useStableCallback(async () => {
    try {
      const template = await templateSelector.selectTemplate();
      form.setFieldsValue({
        resumeJsonData: {
          ...formData.resumeJsonData,
          primary: template.defaultPrimary,
          secondary: template.defaultSecondary,
        },
        sourceCode: template.sourceCode,
      });
    } catch (e) {
      console.log(e);
      showError(e);
    }
  });

  /*---------------------------------------导出数据-------------------------------------------*/

  const [exportOptions] = useState<iDropdownOption[]>(() => {
    return [
      {
        key: 'export-image',
        label: '导出图片',
        handleClick: async () => {
          const imagePath = await getSnapshot({
            el: snapshotElementRef.current!.firstElementChild as any,
            compress: false,
          });
          window.open(pathJoin(env.assetsPrefix, imagePath));
        },
      },
      {
        key: 'export-pdf',
        label: '导出PDF',
        handleClick: () => {
          return exportElement2Pdf(snapshotElementRef.current!.firstElementChild as any);
        },
      },
      {
        key: 'export-data',
        label: '导出数据',
        handleClick: () => {
          console.log('导出数据');
          Modal.info({
            title: '导出数据',
            icon: null,
            closable: true,
            width: 600,
            content: (
              <Input.TextArea
                style={{ minHeight: '400px' }}
                value={JSON.stringify(formDataRef.current)}
              />
            ),
          });
        },
      },
    ];
  });

  /*---------------------------------------上传职业照-------------------------------------------*/

  const { upload } = useUploadService();
  const uploadAvatar = useStableCallback(async () => {
    const avatarFile = await chooseImage();
    setIsLoading(true);
    try {
      const fileRecord = await upload({ file: avatarFile });
      const avatarPath = fileRecord?.path;
      if (!avatarPath) {
        throw new Error('文件上传失败！' + fileRecord);
      }
      form.setFieldValue(['resumeJsonData', 'avatar'], pathJoin(env.assetsPrefix, avatarPath));
    } catch (e: any) {
      console.error(e);
      notification.error({ description: '文件上传失败' + (e.message || JSON.stringify(e)) });
    } finally {
      setIsLoading(false);
    }
  });

  /*---------------------------------------处理AI流式响应消息，主要处理更新简历文案内容-------------------------------------------*/
  const bufferStringHandler = useBufferStringHandler({
    setState: (dispatch) => {
      const value = form.getFieldValue('resumeJsonData');
      form.setFieldValue('resumeJsonData', dispatch(value));
    },
    onBeginProcess: () => {
      /*每次修改简历内容的时候，先重置简历数据*/
      form.setFieldValue('resumeJsonData', {});
      /*强制将视图切换到简历表单视图，因为在流式修改简历信息过程中回频繁触发渲染更新，此时最好不显示preview以及code*/
      setViewMode('data');
    },
    onFinishProcess: () => {
      /*简历信息修改完毕，回到预览视图*/
      setViewMode('preview');
      notification.success({ description: '已经更新完毕！' });
    },
  });

  /*---------------------------------------AI翻译-------------------------------------------*/

  const copilotRef = useRef(null as null | iResumeChatCopilotInstance);

  const [languageOptions] = useState<(iDropdownOption & { promptName: string })[]>(() => {
    const val: (iDropdownOption & { promptName: string })[] = [
      { key: '1', label: 'English', promptName: '英语' },
      { key: '2', label: '日本語', promptName: '日语' },
      { key: '3', label: 'Français', promptName: '法语' },
      { key: '4', label: 'Deutsch', promptName: '德语' },
      { key: '5', label: 'Русский язык', promptName: '俄语' },
      { key: '0', label: '简体中文', promptName: '中文' },
    ];
    val.forEach(
      (item) =>
        (item.handleClick = () => {
          copilotRef.current?.send(
            `翻译成 ${item.promptName}，不要修改我的简历模板代码，简历信息中的primary，secondary以及avatar不变`
          );
        })
    );
    return val;
  });
  return (
    <PageContainer full darkerBackground={!hasInit}>
      <Form form={form} style={{ height: '100%' }}>
        {/*没有这行会缺失 resumeJsonData 部分数据*/}
        <Form.Item name="resumeJsonData" noStyle />
        {hasInit && (
          <>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="page-toolbar">
                <div className="page-toolbar-title">
                  <div>{saveType === 'insert' ? '新建简历' : '编辑简历'}</div>
                </div>
                <div className="page-toolbar-content">
                  <Space>
                    <Form.Item noStyle name={['resumeJsonData', 'primary']}>
                      <ColorButton buttonText="主题色" />
                    </Form.Item>
                    <Form.Item noStyle name={['resumeJsonData', 'secondary']}>
                      <ColorButton buttonText="次级色" />
                    </Form.Item>
                    <Button onClick={reset}>重置代码</Button>
                    <OptionButton options={exportOptions} />
                    <Button onClick={uploadAvatar}>
                      <CloudUploadOutlined />
                      <span>上传职业照</span>
                    </Button>
                    <Button onClick={selectTemplate}>
                      <SearchOutlined />
                      <span>选择模板</span>
                    </Button>
                    <Segmented
                      value={viewMode}
                      onChange={setViewMode}
                      options={ResumeUserViewMode.selectOptions}
                    />
                    <Space.Compact>
                      <Button onClick={() => router.navigate(-1)}>返回</Button>
                      <Button type="primary" onClick={saveDetail}>
                        保存
                      </Button>
                    </Space.Compact>
                  </Space>
                </div>
              </div>
              <div style={{ flex: 1, marginTop: '1em', display: 'flex', alignItems: 'stretch' }}>
                <div
                  style={{
                    flex: 1,
                    marginRight: '1em',
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <FixContainer visible={viewMode === ResumeUserViewMode.code}>
                    <Form.Item noStyle name="sourceCode">
                      {bufferStringHandler.isDataRegion ? (
                        <PageSpin />
                      ) : (
                        <MonacoEditor
                          language="typescript"
                          // 这里需要手动写这两个属性，不然有点bug，撤销编辑的时候不一定拿得到最新的值
                          value={formData.sourceCode}
                          onChange={(val) => {
                            form.setFieldValue('sourceCode', val);
                          }}
                        />
                      )}
                    </Form.Item>
                  </FixContainer>
                  {bufferStringHandler.isDataRegion ? (
                    <PageSpin />
                  ) : (
                    !!formData.resumeJsonData && (
                      <FixContainer visible={viewMode === ResumeUserViewMode.preview}>
                        <div ref={snapshotElementRef} className="render-element">
                          <ReactCodeRender
                            code={formData.sourceCode}
                            attrs={{ data: formData.resumeJsonData }}
                          />
                        </div>
                      </FixContainer>
                    )
                  )}
                  <FixContainer visible={viewMode === ResumeUserViewMode.data}>
                    <Card>
                      <ResumeEditor form={form} />
                    </Card>
                  </FixContainer>
                </div>
                <div style={{ width: '600px', backgroundColor: 'blue', position: 'relative' }}>
                  <FixContainer>
                    <ResumeChatCopilot
                      ref={copilotRef}
                      // value="翻译成日语，技术栈用雷达图展示"
                      systemPrompt={systemPrompt}
                      handleAiMessage={handleAiMessage}
                      onSend={bufferStringHandler.onBegin}
                      handleAiUpdate={bufferStringHandler.onChunk}
                      toolContent={
                        <OptionButton options={languageOptions} handleClick={doNothing}>
                          智能翻译
                        </OptionButton>
                      }
                    />
                  </FixContainer>
                </div>
              </div>
            </div>
          </>
        )}
        {isLoading && <LoadingCover />}
      </Form>
    </PageContainer>
  );
}
