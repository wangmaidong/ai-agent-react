import { useModelState } from '../../uses/useModelState';
import { Button, Dropdown, MenuProps, notification, Space } from 'antd';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { useState } from 'react';

export interface iDropdownOption {
  key: string;
  label: string;
  handleClick?: () => void | Promise<void>;
}

export function OptionButton<T extends iDropdownOption>(props: {
  options: T[];
  handleClick?: () => void | Promise<void>;
  children?: any;
  loading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useModelState(!!props.loading, props.onLoadingChange);
  const [activeKey, setActiveKey] = useState(props.options[0].key);

  const handleClick = async (key: string) => {
    setActiveKey(key);
    setIsLoading(true);
    const opt = props.options.find((i) => i.key === key);
    if (!opt) {
      return;
    }
    try {
      await opt.handleClick?.();
    } catch (e: any) {
      console.error(e);
      notification.error({ message: e.message ?? JSON.stringify(e) });
    } finally {
      setIsLoading(false);
    }
  };

  const onButtonClick = () => {
    handleClick(activeKey);
  };
  const onMenuClick: MenuProps['onClick'] = (e) => {
    handleClick(e.key);
  };

  return (
    <Space.Compact>
      {/* 左侧：主按钮，响应 onClick */}
      <Button
        onClick={props.handleClick ?? onButtonClick}
        disabled={isLoading} // 加载中通常建议禁用点击
      >
        {isLoading && <LoadingOutlined />}
        {props.children ?? props.options.find((i) => i.key === activeKey)?.label ?? activeKey}
      </Button>

      {/* 右侧：下拉菜单触发按钮 */}
      <Dropdown
        menu={{
          items: isLoading ? [] : props.options.map(({ key, label }) => ({ key, label })),
          onClick: onMenuClick,
        }}
        trigger={['click']}
        disabled={isLoading}
        placement="bottomRight"
      >
        <Button icon={<DownOutlined />} />
      </Dropdown>
    </Space.Compact>
  );
}
export default OptionButton;
