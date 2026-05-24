import type { iAutoTable, iAutoTableConfigButton } from "../useAutoTable.utils.tsx";
import React, { useMemo } from "react";
import { PlusOutlined, SignatureOutlined } from "@ant-design/icons";
import { message } from "antd";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";
import { AutoTableButtons } from "../components/AutoTableButtons.tsx";

export const useAutoTableButtons = (autoTable: iAutoTable) => {

  const {
    runningConfig: {
      showCreateButton,
      showEditButton,
      showButtonBar,
    },
    hooks: {
      buttonConfigs,
      searchRender,
    },
    methods: {
      createRecord,
    },
    state: {
      overrideButtonContent,
    },
  } = autoTable;

  /*外部按钮：行内新建*/
  const inlineCreateButtonConfig = useMemo((): iAutoTableConfigButton | null => !showCreateButton ? null : ({
    key: "inlineCreateButton",
    label: "新建",
    primary: true,
    icon: <PlusOutlined />,
    onClick: () => createRecord(),
  }), [showCreateButton, createRecord]);
  buttonConfigs.push(inlineCreateButtonConfig);

  /*下拉按钮：智能新建*/
  const vibeCreateButtonConfig = useMemo((): iAutoTableConfigButton | null => !showCreateButton ? null : ({
    seq: 3,
    key: "vibeCreateButton",
    label: "智能新建",
    icon: <SignatureOutlined />,
    dropdownButton: true,
    onClick: () => {
      message.info("智能新建");
    },
  }), [showCreateButton]);
  buttonConfigs.push(vibeCreateButtonConfig);

  /*将按钮渲染内容添加到 searchRender 中*/
  const searchRenderMeta = useMemo((): iRenderMeta | null => ({
    key: "buttons",
    seq: 10,
    content: <AutoTableButtons />,
  }), []);
  searchRender.use(searchRenderMeta);
};
