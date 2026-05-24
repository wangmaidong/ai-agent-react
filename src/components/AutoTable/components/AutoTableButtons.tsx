import { type iAutoTableConfigButton, useAutoTableContext } from "../useAutoTable.utils.tsx";
import { insertSort } from "@peryl/utils/insertSort.ts";
import { AutoTableDropdownButton } from "./AutoTableDropdownButton.tsx";
import { uuid } from "@peryl/utils/uuid";
import React from "react";
import { Button } from "antd";

export function AutoTableButtons() {

  const {
    state: {
      overrideButtonContent,
    },
    runningConfig: {
      showButtonBar,
    },
    hooks: {
      buttonConfigs,
    },
  } = useAutoTableContext();

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
}
