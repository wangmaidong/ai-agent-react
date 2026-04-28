import { useDetailPage } from '../../../uses/useDetailPage';
import { PageContainer } from '../../../components/PageContainer/PageContainer';
import { useMemo, useState, useRef } from 'react';
import { DEFAULT_RESUME_PRIMARY, DEFAULT_RESUME_SECONDARY } from '../DEMO_RESUME_DATA';
import { iResumeTemplateRecord, ResumeTempViewMode } from '../resume.utils';
import { LoadingCover } from '../../../components/LoadingCover/LoadingCover';
import FixContainer from '../../../components/FixContainer/FixContainer';
import { DEMO_RESUME_DATA } from '../DEMO_RESUME_DATA';
import { ReactCodeRender } from '../../../components/ReactCodeRender/ReactCodeRender';
import ColorButton from '../../../components/ColorButton';
import ResumeChatCopilot from './ResumeChatCopilot';
import { MonacoEditor } from '../../../components/MonacoEditor/MonacoEditor';
import { Button, Form, message, Segmented, Space, Tooltip } from 'antd';
import { generateResumeTemplateCodeSystemPrompt } from './generateResumeTemplateSystemPrompt';
import { copyToClipboard } from '@peryl/utils/copyToClipboard';
import { useStableCallback } from '../../../uses/useStableCallback';
import { modifyResumeTemplateSystemPrompt } from './modifyResumeTemplateSystemPrompt';
import { showError } from '../../../utils/showError';
import { iResumeChatCopilotProps } from './ResumeChatCopilot';
import { useSnapshot } from '../../../uses/useSnapshot';
import { delay } from '@peryl/utils/delay';
import { router } from '../../../layouts/routes';
export default function ResumeTemplateDetailPage() {
  const {
    isLoading,
    saveType,
    form,
    id,
    hasInit,
    record: detailRecord,
    setIsLoading,
    save,
  } = useDetailPage<Partial<iResumeTemplateRecord>>({
    module: 'llm_resume_template',
    onAfterReload: (record, saveType) => {
      /*初始化表单数据之后，根据编辑类型来重设viewMode*/
      setViewMode(saveType === 'insert' ? ResumeTempViewMode.code : ResumeTempViewMode.preview);
    },
    getNewRecord: () => ({
      sourceCode: '',
      defaultPrimary: DEFAULT_RESUME_PRIMARY,
      defaultSecondary: DEFAULT_RESUME_SECONDARY,
    }),
  });

  /*
   * 编辑的时候会默认打开预览视图
   * 新建的时候默认打开编码视图，待新建的ID申请完之后，这里的初始值还是code，所以不影响
   */
  const [viewMode, setViewMode] = useState<typeof ResumeTempViewMode.TYPES>(
    id === 'new' ? ResumeTempViewMode.code : ResumeTempViewMode.preview
  );
  /*拿到所有的表单数据*/
  const formData = Form.useWatch(null, form) ?? {};

  /*用来生成快照预览图的dom对象引用*/
  const snapshotElementRef = useRef(null as null | HTMLDivElement);

  /*用来渲染模板的简历数据，将主题色修改为表单中的数据*/
  const demoData = useMemo(() => {
    return {
      ...DEMO_RESUME_DATA,
      primary: formData.defaultPrimary ?? DEFAULT_RESUME_PRIMARY,
      secondary: formData.defaultSecondary ?? DEFAULT_RESUME_SECONDARY,
    };
  }, [formData.defaultPrimary, formData.defaultSecondary]);

  /*保存模板数据，重新生成预览图*/
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
        ...form.getFieldsValue(),
        id: id,
        thumbImage: thumbImagePath,
      } satisfies Partial<iResumeTemplateRecord>);
    } catch (e) {
      showError(e);
    } finally {
      setIsLoading(false);
    }
  });
  /*系统提示词*/
  const systemPrompt = useStableCallback(() =>
    modifyResumeTemplateSystemPrompt(formData.sourceCode)
  );

  /*处理AI响应结果*/
  const handleAiMessage: iResumeChatCopilotProps['handleAiMessage'] = useStableCallback(
    async (message) => {
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
    }
  );
  return (
    <PageContainer full darkerBackground={false}>
      <Form form={form} style={{ height: '100%' }}>
        {hasInit && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="page-toolbar">
              <div className="page-toolbar-title">
                <div>{saveType === 'insert' ? '新建模板' : '编辑模板'}</div>
              </div>
              <div className="page-toolbar-content">
                <Space>
                  <Form.Item noStyle name="defaultPrimary">
                    <ColorButton buttonText="主题色" />
                  </Form.Item>
                  <Form.Item noStyle name="defaultSecondary">
                    <ColorButton buttonText="次级色" />
                  </Form.Item>
                  <Tooltip title="用于在顶级模型中(exp:Gemini)根据参考图生成组件代码">
                    <Button
                      type="dashed"
                      onClick={() => {
                        copyToClipboard(generateResumeTemplateCodeSystemPrompt, () =>
                          message.success('已复制')
                        );
                      }}
                    >
                      复制简历生成提示词
                    </Button>
                  </Tooltip>
                  <Segmented
                    value={viewMode}
                    onChange={setViewMode}
                    options={ResumeTempViewMode.selectOptions}
                  />
                  <Button
                    onClick={() => {
                      form.setFieldValue('sourceCode', detailRecord.sourceCode);
                    }}
                  >
                    重置代码
                  </Button>
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
                <FixContainer visible={viewMode === ResumeTempViewMode.code}>
                  <Form.Item noStyle name="sourceCode">
                    <MonacoEditor
                      language="typescript"
                      // 这里需要手动写这两个属性，不然有点bug，撤销编辑的时候不一定拿得到最新的值
                      value={formData.sourceCode}
                      onChange={(val) => {
                        form.setFieldValue('sourceCode', val);
                      }}
                    />
                  </Form.Item>
                </FixContainer>
                <FixContainer visible={viewMode === ResumeTempViewMode.preview}>
                  <div ref={snapshotElementRef}>
                    <ReactCodeRender code={formData.sourceCode} attrs={{ data: demoData }} />
                  </div>
                </FixContainer>
              </div>
              <div
                style={{
                  width: '600px',
                  backgroundColor: '#c3d3ff',
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <FixContainer>
                  <ResumeChatCopilot
                    // value="请用table布局排版基本信息里边的图标、字段名以及字段值，使得字段名之间左对齐，字段值之间左对齐"
                    systemPrompt={systemPrompt}
                    handleAiMessage={handleAiMessage}
                  />
                </FixContainer>
              </div>
            </div>
          </div>
        )}
        {isLoading && <LoadingCover />}
      </Form>
    </PageContainer>
  );
}
