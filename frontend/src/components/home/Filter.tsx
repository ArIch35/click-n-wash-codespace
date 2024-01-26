import React, { useEffect } from 'react';
import { getLaundromatFilters } from '../../utils/api';
import { Stack, Select, TextInput, Button, RangeSlider } from '@mantine/core';

export interface SearchFilter {
  name?: string;
  city?: string;
  priceFrom?: number;
  priceTo?: number;
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

const Filter: React.FC<FilterProps> = ({ onFilterSelected, onFilterReset }) => {
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

  const returnValidFilter = (filter: SearchFilter) => {
    const oneOfThePriceChanged =
      filter.priceFrom !== requestFilter!.minPrice || filter.priceTo !== requestFilter!.maxPrice;
    onFilterSelected({
      name: !filter.name || filter.name === '' ? undefined : filter.name,
      city: !filter.city || filter.city === '' ? undefined : filter.city,
      priceFrom: !oneOfThePriceChanged || filter.priceFrom === -1 ? undefined : filter.priceFrom,
      priceTo: !oneOfThePriceChanged || filter.priceTo === -1 ? undefined : filter.priceTo,
    });
  };

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
          key={searchFilter.city}
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
          value={[
            searchFilter.priceFrom! === -1 ? requestFilter.minPrice : searchFilter.priceFrom!,
            searchFilter.priceTo! === -1 ? requestFilter.maxPrice : searchFilter.priceTo!,
          ]}
          onChange={(value) => {
            setSearchFilter({ ...searchFilter, priceFrom: value[0], priceTo: value[1] });
          }}
        />
      )}
      <Button
        onClick={() => {
          returnValidFilter(searchFilter);
        }}
      >
        Filter
      </Button>
      <Button
        onClick={() => {
          setSearchFilter({
            name: '',
            city: '',
            priceFrom: requestFilter!.minPrice,
            priceTo: requestFilter!.maxPrice,
          });
          onFilterReset();
        }}
      >
        Reset
      </Button>
    </Stack>
  );
};

export default Filter;
