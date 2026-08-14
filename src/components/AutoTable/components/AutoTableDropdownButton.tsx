import type { iAutoTableConfigButton } from "../useAutoTable.utils.tsx";
import { Button, Dropdown, type MenuProps, Space } from "antd";
import DownOutlined from "@ant-design/icons/DownOutlined";
import React, { useMemo, useState } from "react";

/*
* AutoTable按钮栏 更多按钮
*/
export function AutoTableDropdownButton(
  {
    buttonConfigs,
  }: {
    buttonConfigs: iAutoTableConfigButton[]
  }) {

  const [lastActiveButtonKey, setLastActiveButtonKey] = useState(null as null | string);
  const lastActiveButton = useMemo(() => buttonConfigs.find(i => i.key === lastActiveButtonKey), [buttonConfigs, lastActiveButtonKey]);

  const dropdownMenuOptions = useMemo((): MenuProps["items"] => buttonConfigs.map(item => ({
    label: item.label,
    icon: item.icon,
    key: item.key,
    disabled: item.disabled || item.loading,
    onClick: () => {
      setLastActiveButtonKey(item.key);
      item.onClick?.();
    },
    // eslint-disable-next-line
  })), [...buttonConfigs]);

  if (!buttonConfigs.length) {return null;}

  return (
    <Dropdown menu={{ items: dropdownMenuOptions }}>
      <Space.Compact>
        {lastActiveButton ? (
          <Button
            icon={lastActiveButton.icon}
            type={lastActiveButton.primary ? "primary" : "default"}
            onClick={lastActiveButton.onClick}
            disabled={lastActiveButton.disabled}
            loading={lastActiveButton.loading}
          >
            {lastActiveButton.label}
          </Button>
        ) : (<Button>更多</Button>)}
        <Button icon={<DownOutlined />} />
      </Space.Compact>
    </Dropdown>
  );
}
