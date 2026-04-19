import { useDetailPage } from "../../../uses/useDetailPage";
import { PageContainer } from "../../../components/PageContainer/PageContainer";
import { Form, Input, Space } from "antd";
import { useMemo, useRef, useState } from "react";
import { DEFAULT_RESUME_PRIMARY, DEFAULT_RESUME_SECONDARY, DEMO_RESUME_DATA } from "../DEMO_RESUME_DATA";
import { iResumeTemplateRecord, ResumeTempViewMode } from "../resume.utils";
import { LoadingCover } from "../../../components/LoadingCover/LoadingCover";
import FixContainer from "../../../components/FixContainer/FixContainer";
import { ReactCodeRender } from "../../../components/ReactCodeRender/ReactCodeRender";
import ColorButton from "../../../components/ColorButton";
import { ResumeChatCopilot } from "./ResumeChatCopilot";

export default () => {

  const {
    isLoading,
    saveType,
    form,
    id,
    hasInit,
  } = useDetailPage<Partial<iResumeTemplateRecord>>({
    module: "llm_resume_template",
    onAfterReload: (record, saveType) => {
      /*初始化表单数据之后，根据编辑类型来重设viewMode*/
      setViewMode(saveType === "insert" ? ResumeTempViewMode.code : ResumeTempViewMode.preview);
    },
    getNewRecord: () => ({
      sourceCode: "",
      defaultPrimary: DEFAULT_RESUME_PRIMARY,
      defaultSecondary: DEFAULT_RESUME_SECONDARY,
    }),
  });

  /*
  * 编辑的时候会默认打开预览视图
  * 新建的时候默认打开编码视图，待新建的ID申请完之后，这里的初始值还是code，所以不影响
  */
  const [viewMode, setViewMode] = useState<typeof ResumeTempViewMode.TYPES>(id === "new" ? ResumeTempViewMode.code : ResumeTempViewMode.preview);

  const formData = Form.useWatch(undefined, form) ?? {};

  const snapshotElementRef = useRef(null as null | HTMLDivElement);

  /*用来渲染模板的简历数据，将主题色修改为表单中的数据*/
  const demoData = useMemo(() => {
    return {
      ...DEMO_RESUME_DATA,
      primary: formData.defaultPrimary ?? DEFAULT_RESUME_PRIMARY,
      secondary: formData.defaultSecondary ?? DEFAULT_RESUME_SECONDARY,
    };
  }, [formData.defaultPrimary, formData.defaultSecondary]);

  const [demoSystemPrompt, setDemoSystemPrompt] = useState("你必须使用英语回答问题");

  return (
    <PageContainer full darkerBackground={false}>
      <Form form={form} style={{ height: "100%" }}>
        {hasInit && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="page-toolbar">
              <div className="page-toolbar-title">
                <div>{saveType === "insert" ? "新建模板" : "编辑模板"}</div>
              </div>
              <div className="page-toolbar-content">
                <Space>
                  <Form.Item noStyle name="defaultPrimary">
                    <ColorButton buttonText="主题色" />
                  </Form.Item>
                  <Form.Item noStyle name="defaultSecondary">
                    <ColorButton buttonText="次级色" />
                  </Form.Item>
                  <Input value={demoSystemPrompt} onChange={e => setDemoSystemPrompt(e.target.value)} />
                </Space>
              </div>
            </div>
            <div style={{ flex: 1, marginTop: "1em", display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, marginRight: "1em", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                <FixContainer visible={viewMode === ResumeTempViewMode.code}>
                  <Form.Item noStyle name="sourceCode">
                  </Form.Item>
                </FixContainer>
                <FixContainer visible={viewMode === ResumeTempViewMode.preview}>
                  <div ref={snapshotElementRef}>
                    <ReactCodeRender code={formData.sourceCode} attrs={{ data: demoData }} />
                  </div>
                </FixContainer>
              </div>
              <div style={{ width: "325px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                <FixContainer>
                  <ResumeChatCopilot systemPrompt={demoSystemPrompt} />
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
