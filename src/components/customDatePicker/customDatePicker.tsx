import { DatePicker2 } from '@alifd/next';
import { useField } from '@formily/react';
import { GeneralField } from '@formily/core';

const CustomDatePicker = () => {
  const field: GeneralField & {
    value: any;
    setValue: (date) => void;
  } = useField();
  return (
    <DatePicker2.RangePicker
      value={field.value}
      onChange={(date) => {
        field.setValue(date.map((item) => item.format('YYYY-MM-DD')));
      }}
    />
  );
};

export default CustomDatePicker;
