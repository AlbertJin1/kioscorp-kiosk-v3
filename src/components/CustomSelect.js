import React, { useState } from 'react';
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const CustomSelect = ({ value, onChange }) => {
    const options = [
        { value: 'name-asc', label: 'Name Ascending', icon: <FaSortAlphaDown /> },
        { value: 'name-desc', label: 'Name Descending', icon: <FaSortAlphaUp /> },
        { value: 'price-asc', label: 'Price Low to High', icon: <FaSortAmountDown /> },
        { value: 'price-desc', label: 'Price High to Low', icon: <FaSortAmountUp /> },
    ];

    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 border border-gray-300 rounded text-4xl font-bold w-full flex items-center justify-between"
            >
                <span>{options.find(option => option.value === value)?.label || 'Sort by'}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg mt-1">
                    {options.map(option => (
                        <li
                            key={option.value}
                            onClick={() => handleOptionClick(option)}
                            className="flex items-center p-2 hover:bg-gray-200 cursor-pointer text-4xl"
                        >
                            <span className="mr-2">{option.icon}</span>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;