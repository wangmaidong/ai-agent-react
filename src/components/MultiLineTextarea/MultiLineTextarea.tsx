import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input';

interface MultiLineTextareaProps extends Omit<TextAreaProps, 'value' | 'onChange'> {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const MultiLineTextarea: React.FC<MultiLineTextareaProps> = ({
  value,
  onChange,
  onBlur,
  ...restProps
}) => {
  // 内部维护一个字符串，确保输入时物权在本地，光标不会跳
  const [innerValue, setInnerValue] = useState('');

  // 外部 value 改变时同步到内部 (例如表单重置或初始加载)
  useEffect(() => {
    const nextValue = Array.isArray(value) ? value.join('\n') : '';
    // 只有当外部值和内部值真正不一致时才同步，防止输入过程中的干扰
    if (nextValue !== innerValue) {
      setInnerValue(nextValue);
    }
  }, [value, innerValue]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInnerValue(newValue); // 立即更新内部字符串，维持光标位置

    // 实时同步给父组件，但不进行 trim 和 filter
    // 这样可以保留用户的换行动作，直到他们完成输入
    if (onChange) {
      onChange(newValue.split('\n'));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // 在失去焦点时，进行数据清洗：去空格、删空行
    const cleanedArray = innerValue
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    if (onChange) {
      onChange(cleanedArray);
    }

    // 执行外部传入的 onBlur
    onBlur?.(e);
  };

  return (
    <Input.TextArea
      {...restProps}
      value={innerValue}
      onChange={handleTextChange}
      onBlur={handleBlur}
    />
  );
};

export default MultiLineTextarea;
