import type { iAutoTable, iAutoTableConfigButton } from "../useAutoTable.utils.tsx";
import React, { useMemo } from "react";
import { EditOutlined, PlusOutlined, SignatureOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import type { iRenderMeta } from "../../../uses/useRenderHook.tsx";
import { uuid } from "@peryl/utils/uuid";
import { insertSort } from "@peryl/utils/insertSort.ts";
import { AutoTableDropdownButton } from "../components/AutoTableDropdownButton.tsx";

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

  /*下拉按钮：表单新建*/
  const formCreateButtonConfig = useMemo((): iAutoTableConfigButton | null => !showCreateButton ? null : ({
    seq: 1,
    key: "formCreateButton",
    label: "表单新建",
    icon: <PlusOutlined />,
    dropdownButton: true,
    onClick: () => {
      message.info("表单新建");
    },
  }), [showCreateButton]);
  buttonConfigs.push(formCreateButtonConfig);

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

  /*下拉按钮：表单编辑*/
  const formEditButtonConfig = useMemo((): iAutoTableConfigButton | null => !showEditButton ? null : ({
    seq: 2,
    key: "formEditButton",
    label: "表单编辑",
    icon: <EditOutlined />,
    dropdownButton: true,
    onClick: () => {
      message.info("表单编辑");
    },
  }), [showEditButton]);
  buttonConfigs.push(formEditButtonConfig);

  /*将按钮渲染内容添加到 searchRender 中*/
  const searchRenderMeta = useMemo((): iRenderMeta | null => ({
    key: "buttons",
    seq: 10,
    content: () => {
      if (!!overrideButtonContent) {
        return overrideButtonContent;
      }
      if (!showButtonBar) {
        return null;
      }
      const notNullButtonConfigs: iAutoTableConfigButton[] = buttonConfigs.filter(i => i != null).map(i => ({
        ...i,
        key: i.key ?? uuid(), // 没有key就给一个随机key
        seq: i.seq ?? 10,     // 没有顺序就给10，排到最后
      }));
      /*去掉重复key的按钮*/
      const buttonConfigMapper = notNullButtonConfigs.reduce((prev, item) => {
        prev[item.key!] = item;
        return prev;
      }, {} as Record<string, iAutoTableConfigButton>);
      const targetButtonConfigs = insertSort(Object.values(buttonConfigMapper), (a, b) => a.seq! > b.seq!);
      if (!targetButtonConfigs.length) {
        return null;
      }
      const outerButtons = targetButtonConfigs.filter(i => !i.dropdownButton);
      const innerButtons = targetButtonConfigs.filter(i => i.dropdownButton);
      return <>
        {outerButtons.map(btn => (
          <React.Fragment key={btn.key}>
            {btn.render ? btn.render : (
              <Button
                icon={btn.icon}
                type={btn.primary ? "primary" : "default"}
                onClick={btn.onClick}
                disabled={btn.disabled}
                loading={btn.loading}
              >
                {btn.label}
              </Button>
            )}
          </React.Fragment>
        ))}
        {innerButtons.length && (<AutoTableDropdownButton buttonConfigs={innerButtons} />)}
      </>;
    },
    // eslint-disable-next-line
  }), [showButtonBar, overrideButtonContent, ...buttonConfigs]);
  console.log([showButtonBar, overrideButtonContent, ...buttonConfigs]);

  searchRender.use(searchRenderMeta);
};
