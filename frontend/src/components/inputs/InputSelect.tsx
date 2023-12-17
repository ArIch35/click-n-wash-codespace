import { Select } from '@mantine/core';

interface InputSelectProps {
  name: string;
  options: { value: string; label: string }[];
}

const InputSelect = ({ name, options, ...props }: InputSelectProps) => {
  return <Select id={name} data={options} searchable withCheckIcon limit={5} {...props} />;
};

export default InputSelect;
