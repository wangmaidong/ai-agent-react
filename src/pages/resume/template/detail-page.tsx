import { useDetailPage } from "../../../uses/useDetailPage";
import { PageContainer } from "../../../components/PageContainer/PageContainer";
import { Form } from "antd";
import { useState } from "react";
import { DEFAULT_RESUME_PRIMARY, DEFAULT_RESUME_SECONDARY } from "../DEMO_RESUME_DATA";
import { iResumeTemplateRecord, ResumeTempViewMode } from "../resume.utils";
import { LoadingCover } from "../../../components/LoadingCover/LoadingCover";
import FixContainer from "../../../components/FixContainer/FixContainer";

export default function ResumeTemplateDetailPage() {

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


  return (
    <PageContainer full darkerBackground={false}>
      <Form form={form} style={{ height: "100%" }}>
        {hasInit && (
          <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="page-toolbar" style={{ backgroundColor: "#ffd9d9" }}>
              <div className="page-toolbar-title">
                <div>{saveType === "insert" ? "新建模板" : "编辑模板"}</div>
              </div>
              <div className="page-toolbar-content">
                工具栏按钮
              </div>
            </div>
            <div style={{ flex: 1, marginTop: "1em", display: "flex", alignItems: "stretch" }}>
              <div style={{ flex: 1, marginRight: "1em", position: "relative", borderRadius: "8px", overflow: "hidden", backgroundColor: "#e4ffd9" }}>
                <FixContainer visible={viewMode === ResumeTempViewMode.code}>
                  代码编辑器
                </FixContainer>
                <FixContainer visible={viewMode === ResumeTempViewMode.preview}>
                  内容渲染区域
                </FixContainer>
              </div>
              <div style={{ width: "325px", backgroundColor: "#c3d3ff", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                <FixContainer>
                  聊天助手区域
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
