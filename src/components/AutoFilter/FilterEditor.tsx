import { Form, Select, Space } from "antd";
import React, { useCallback, useMemo } from "react";
import { type PlainObject } from "@peryl/utils/event";
import { type FormInstance } from "antd/es/form/hooks/useForm";
import "./filter-editor.scss";
import { FilterConfiguration, type iFilterOption } from "./AutoFilter.utils.tsx";

export function FilterEditor(props: {
  value: iFilterOption,
  onChange?: (newOption: iFilterOption) => void,
  handleConfirm?: () => void,
  formData: PlainObject,
  form: FormInstance,
  append?: React.ReactNode,
  prepend?: React.ReactNode,
}) {

  const { handleConfirm: _handleConfirm } = props;
  const { filterType, filterSubType, field } = props.value;

  const subTypes = useMemo(() => FilterConfiguration.getSubTypes(filterType), [filterType]);

  const matchSubType = useMemo(() => subTypes.find(i => i.filterSubType === filterSubType), [filterSubType, subTypes]);

  const filterValue = useMemo(() => props.formData[field], [props.formData, field]);

  const handleConfirm = useCallback(() => _handleConfirm?.(), [_handleConfirm]);

  const filterSubTypeOptions = useMemo(() => subTypes.map((i) => ({ label: i.label, value: i.filterSubType })), [subTypes]);

  return (
    <Space.Compact className="filter-editor">
      {props.prepend}
      <Select
        style={{ minWidth: "100px" }}
        value={filterSubType}
        onChange={(value) => {
          props.form.setFieldValue(field, null);
          props.onChange?.({ ...props.value, filterSubType: value });
        }}
        options={filterSubTypeOptions}
      />
      <Form.Item noStyle name={field}>
        <div className="filter-editor-item">{matchSubType?.filterEditor?.({ value: filterValue, formData: props.formData, form: props.form, filterOption: props.value, confirm: handleConfirm })}</div>
      </Form.Item>
      {props.append}
    </Space.Compact>
  );
}
