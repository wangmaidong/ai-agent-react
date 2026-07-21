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

  const [lastActiveButtonConfig, setLastActiveButtonConfig] = useState(null as null | iAutoTableConfigButton);

  const dropdownMenuOptions = useMemo((): MenuProps["items"] => buttonConfigs.map(item => ({
    label: item.label,
    icon: item.icon,
    key: item.key,
    disabled: item.disabled || item.loading,
    onClick: () => {
      setLastActiveButtonConfig(item);
      item.onClick?.();
    },
    // eslint-disable-next-line
  })), [...buttonConfigs]);

  if (!buttonConfigs.length) {return null;}

  return (
    <Dropdown menu={{ items: dropdownMenuOptions }}>
      <Space.Compact>
        {lastActiveButtonConfig ? (
          <Button
            icon={lastActiveButtonConfig.icon}
            type={lastActiveButtonConfig.primary ? "primary" : "default"}
            onClick={lastActiveButtonConfig.onClick}
            disabled={lastActiveButtonConfig.disabled}
            loading={lastActiveButtonConfig.loading}
          >
            {lastActiveButtonConfig.label}
          </Button>
        ) : (<Button>更多</Button>)}
        <Button icon={<DownOutlined />} />
      </Space.Compact>
    </Dropdown>
  );
}
