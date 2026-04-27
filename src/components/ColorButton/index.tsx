import React, { useState } from 'react';
import { Button, ColorPicker, ColorPickerProps, Space } from 'antd';
import styled from '@emotion/styled';

// 可选：利用 emotion 微调紧凑模式下的样式
const StyledCompact = styled(Space.Compact)`
  width: 100%;
  .ant-color-picker-trigger {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .ant-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

interface ThemeColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  buttonText?: string;
}

const ColorButton: React.FC<ThemeColorPickerProps> = ({
  value,
  onChange,
  buttonText = '主题色',
}) => {
  const [open, setOpen] = useState(false);

  // 处理颜色变化
  const handleChange: ColorPickerProps['onChange'] = (colorObj) => {
    // 转换为 hex 字符串回传给父组件/Form
    const hexString = colorObj.toHexString();
    onChange?.(hexString);
  };

  return (
    <StyledCompact>
      <ColorPicker value={value} open={open} onOpenChange={setOpen} onChange={handleChange} />
      <Button
        icon={<i className="bi bi-palette" style={{ marginRight: 4 }} />}
        onClick={() => setOpen(true)}
      >
        {buttonText}
      </Button>
    </StyledCompact>
  );
};

export default ColorButton;
