import type { iAutoTable, iAutoTableConfigButton } from "../useAutoTable.utils.tsx";
import { useCallback, useMemo } from "react";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useFormService } from "../../AutoForm/useFormService.tsx";
import type { PlainObject } from "@peryl/utils/event";
import { message } from "antd";

export function useAutoTableFormService(autoTable: iAutoTable) {

  const {
    state: { renderColumnsRef },
    methods: { getDefaultNewRow, requestUpsert },
    runningConfig: { showCreateButton, showEditButton, autoFormGridCols },
    hooks: { buttonConfigs },
    singleSelect: { singleSelectRecord },
  } = autoTable;

  const { openFormDrawer } = useFormService();

  /*表单新建数据*/
  const formCreateRecord = useCallback(async (initialValues?: PlainObject) => {
    /*默认的新行数据*/
    const initialNewRecord = await getDefaultNewRow(initialValues);
    const columns = renderColumnsRef.current.filter(i => !!i.type && !!i.dataIndex && !i.standard);
    openFormDrawer({
      record: initialNewRecord,
      columns: columns,
      drawerWidth: autoFormGridCols! * 400,
      autoFormProps: { gridCols: autoFormGridCols! },
      handleConfirm: async (editRecord) => requestUpsert({ sourceRecord: initialNewRecord, editRecord, isCreatedRecord: true, isFormCreate: true }),
    });
  }, [openFormDrawer, getDefaultNewRow, requestUpsert, renderColumnsRef, autoFormGridCols]);

  /*表单编辑数据*/
  const formEditRecord = useCallback(async ({ record, isCreateRecord }: { record: PlainObject, isCreateRecord: boolean }) => {
    console.log("formEditRecord", record);
    const columns = renderColumnsRef.current.filter(i => !!i.type && !!i.dataIndex && !i.standard);
    openFormDrawer({
      record: record,
      columns: columns,
      drawerWidth: autoFormGridCols! * 400,
      autoFormProps: { gridCols: autoFormGridCols! },
      handleConfirm: async (editRecord) => requestUpsert({ sourceRecord: record, editRecord, isCreatedRecord: isCreateRecord, isFormCreate: false }),
    });
  }, [openFormDrawer, requestUpsert, renderColumnsRef, autoFormGridCols]);

  const formEditCurrentRecord = useCallback(() => {
    if (!singleSelectRecord) {
      return message.warning("请选择一条数据进行编辑！");
    }
    return formEditRecord({ record: singleSelectRecord, isCreateRecord: false });
  }, [formEditRecord, singleSelectRecord]);

  /*下拉按钮：表单新建*/
  const formCreateButtonConfig = useMemo((): iAutoTableConfigButton | null => !showCreateButton ? null : ({
    seq: 1,
    key: "formCreateButton",
    label: "表单新建",
    icon: <PlusOutlined />,
    dropdownButton: true,
    onClick: () => formCreateRecord(),
  }), [showCreateButton, formCreateRecord]);
  // eslint-disable-next-line react-hooks/refs
  buttonConfigs.push(formCreateButtonConfig);

  /*下拉按钮：表单编辑*/
  const formEditButtonConfig = useMemo((): iAutoTableConfigButton | null => !showEditButton ? null : ({
    seq: 2,
    key: "formEditButton",
    label: "表单编辑",
    icon: <EditOutlined />,
    dropdownButton: true,
    onClick: formEditCurrentRecord,
  }), [showEditButton, formEditCurrentRecord]);
  // eslint-disable-next-line react-hooks/refs
  buttonConfigs.push(formEditButtonConfig);

  return {
    formService: {
      openFormDrawer,
      formCreateRecord,
      formEditRecord,
    },
  };
}

export type iAutoTableFormService = ReturnType<typeof useAutoTableFormService>["formService"]

declare module "../useAutoTable.utils.tsx" {
  interface iAutoTable {
    formService: iAutoTableFormService;
  }
}
