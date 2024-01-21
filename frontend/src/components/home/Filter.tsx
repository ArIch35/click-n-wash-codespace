import React, { useEffect } from 'react';
import { getLaundromatFilters } from '../../utils/api';
import { Stack, Select, TextInput, Button, RangeSlider } from '@mantine/core';

export interface SearchFilter {
  name: string;
  city: string;
  priceFrom: number;
  priceTo: number;
}

export interface RequestFilter {
  cities: string[];
  maxPrice: number;
  minPrice: number;
}

type FilterProps = {
  onFilterSelected: (filter: SearchFilter | undefined) => void;
};

const Filter: React.FC<FilterProps> = ({ onFilterSelected }) => {
  const [requestFilter, setRequestFilter] = React.useState<RequestFilter | null>();
  const [searchFilter, setSearchFilter] = React.useState<SearchFilter>({
    name: '',
    city: '',
    priceFrom: -1,
    priceTo: -1,
  });

  useEffect(() => {
    getLaundromatFilters()
      .then((filters) => {
        setRequestFilter(filters);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Stack>
      <TextInput
        label="Laundromat name"
        placeholder="Pick Name"
        value={searchFilter.name}
        onChange={(event) => setSearchFilter({ ...searchFilter, name: event.currentTarget.value })}
      />
      {requestFilter && (
        <Select
          label="Laundromat City"
          placeholder="Pick City"
          data={requestFilter.cities}
          searchable
          value={searchFilter.city}
          onChange={(value) => {
            setSearchFilter({ ...searchFilter, city: value! });
          }}
        />
      )}
      {requestFilter && (
        <RangeSlider
          min={requestFilter.minPrice}
          max={requestFilter.maxPrice}
          step={1}
          minRange={5}
          defaultValue={[requestFilter.minPrice, requestFilter.maxPrice]}
          onChange={(value) => {
            setSearchFilter({ ...searchFilter, priceFrom: value[0], priceTo: value[1] });
          }}
        />
      )}
      <Button
        onClick={() => {
          onFilterSelected(searchFilter);
        }}
      >
        Filter
      </Button>
    </Stack>
  );
};

export default Filter;
