import { Button, Card, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import { getLaundromatFilters } from '../../utils/api';
import FormInputFields from '../ui/form-input-fields';

export interface SearchFilter {
  name?: string;
  city?: string;
  price?: [number, number];
}

export interface RequestFilter {
  cities: string[];
  maxPrice: number;
  minPrice: number;
}

type FilterProps = {
  onFilterSelected: (filter: SearchFilter) => void;
  onFilterReset: () => void;
};

const initialValues: SearchFilter = {
  name: '',
  city: '',
  price: [0, 0],
};

const Filter: React.FC<FilterProps> = ({ onFilterSelected, onFilterReset }) => {
  const [requestFilter, setRequestFilter] = React.useState<RequestFilter | null>();

  const form = useForm<SearchFilter>({
    initialValues,
  });

  const onSubmit = (values: SearchFilter, event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    onFilterSelected(values);
  };

  useEffect(() => {
    getLaundromatFilters()
      .then((filters) => {
        setRequestFilter(filters);
        form.setInitialValues({
          ...form.values,
          price: [filters.minPrice, filters.maxPrice],
        });
        form.reset();
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Card withBorder>
        <Stack>
          {requestFilter && (
            <FormInputFields
              form={form}
              values={form.values}
              customComponent={{ price: 'RangeSlider', city: 'Autocomplete' }}
              props={{
                name: { placeholder: 'Mary Jane laundromat' },
                city: { placeholder: 'Darmstadt', data: requestFilter.cities },
                price: { minRange: 1, min: requestFilter.minPrice, max: requestFilter.maxPrice },
              }}
            />
          )}
          <Button type="submit">Filter</Button>
          <Button
            onClick={() => {
              form.reset();
              onFilterReset();
            }}
          >
            Reset
          </Button>
        </Stack>
      </Card>
    </form>
  );
};

export default Filter;
