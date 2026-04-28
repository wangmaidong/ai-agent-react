import { defer } from "@peryl/utils/defer";
import { useStableCallback } from "../../../uses/useStableCallback";
import { iResumeTemplateRecord } from "../resume.utils";
import { CardList } from "../../../components/CardList/CardList";
import { produce } from "immer";
import { notification } from "antd";
import { useListPage } from "../../../uses/useListPage";
import { useModalService } from "../../../uses/useModalService";

export function useResumeTemplateSelector() {

  const { openModal } = useModalService();

  const selectTemplate = useStableCallback(async () => {

    const dfd = defer<iResumeTemplateRecord>();

    let selectedTemplate: iResumeTemplateRecord | undefined = undefined;

    const Content = () => {
      const { recordList, setRecordList } = useListPage<iResumeTemplateRecord & { checked?: boolean }>({
        module: "llm_resume_template",
      });
      return (
        <div style={{ height: "60vh", overflow: "auto" }}>
          <CardList
            data={recordList}
            col={4}
            onClickItem={(e) => {
              setRecordList(prevState => (
                produce(prevState, draft => {
                  draft.forEach((item, index) => {
                    if (item.id === e.item.id) {
                      item.checked = true;
                      selectedTemplate = recordList[index];
                    } else {
                      item.checked = false;
                    }
                  });
                })
              ));
            }}
            onDoubleClickItem={() => triggerConfirm()}
          />
        </div>
      );
    };

    const { triggerConfirm } = openModal({
      modalProps: {
        title: "选择模板",
        closable: true,
        width: 600,
      },
      content: <Content />,
      handleConfirm: () => {
        if (!selectedTemplate) {
          notification.warning({ description: "请选择模板" });
          return false;
        }
        dfd.resolve(selectedTemplate);
      },
      handleCancel: () => {dfd.reject("cancel");},
    });

    return dfd.promise;
  });

  return { selectTemplate };
}
