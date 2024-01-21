import React, { useEffect } from 'react';
import { getLaundromatFilters } from '../../utils/api';

export interface SearchFilter {
    name?: string;
    city?: string;
    priceFrom?: number;
    priceTo?: number;
}

export interface RequestFilter {
    cities: string[];
    maxPrice: number;
}

type FilterProps = {
    onFilterSelected: (filter: SearchFilter) => void;
};

const Filter: React.FC<FilterProps> = ({ onFilterSelected }) => {
    useEffect(() => {
        getLaundromatFilters().then((filters) => {
            console.log(filters);
        }).catch((error) => {
            console.error(error);
        });
    }, []);
    return (
        <div>
            <h1>Filter</h1>
        </div>
    );
};

export default Filter;
