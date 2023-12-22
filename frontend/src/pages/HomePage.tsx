import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import InputSelect from '../components/inputs/InputSelect';

const HomePage = () => {
  const form = useForm({
    initialValues: {
      location: '',
    },
  });

  useEffect(() => {
    const storedValue = window.localStorage.getItem('location-form');
    if (storedValue) {
      try {
        const parsedValue = storedValue;
        console.log(parsedValue);
        form.setValues({ location: parsedValue });
      } catch (e) {
        console.error(e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('location-form', form.values.location);
  }, [form.values]);

  return (
    <InputSelect
      name="test"
      options={[
        { value: 'test', label: 'test' },
        { value: 'test2', label: 'test2' },
      ]}
      {...form.getInputProps('location')}
    />
  );
};

export default HomePage;
