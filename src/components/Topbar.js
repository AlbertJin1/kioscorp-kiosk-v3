import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import the clear icon
import axios from 'axios';
import Fuse from 'fuse.js';
import CustomSelect from './CustomSelect'; // Import the custom select component

const Topbar = ({ searchTerm, setSearchTerm, sortOption, setSortOption, products, token }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (products && searchTerm) {
            const filteredSuggestions = products.filter(product =>
                product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, products]);

    const fetchSuggestions = async (term) => {
        if (!term) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/products/', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            const data = response.data;

            const fuse = new Fuse(data, {
                keys: ['product_name'],
                threshold: 0.6,
            });

            const result = fuse.search(term);
            const suggestions = result.map((item) => item.item);
            setSuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(value.length > 0); // Show suggestions if there's input
        fetchSuggestions(value);
    };

    const highlightMatch = (text, term) => {
        if (!term) return text;
        const parts = text.split(new RegExp(`(${term})`, 'gi')); // Split the text into parts based on the search term
        return parts.map((part, index) =>
            part.toLowerCase() === term.toLowerCase() ? (
                <span key={index} className="font-bold text-blue-500">{part}</span>
            ) : (
                part
            )
        );
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.product_name); // Set the search term to the selected suggestion
        setSuggestions([]); // Clear suggestions
        setShowSuggestions(false); // Hide suggestions after selection
        // Navigate to the product details page (if needed)
        // navigate(`/products/${suggestion.product_id}`);
    };

    const clearSearch = () => {
        setSearchTerm(''); // Clear the search term
        setSuggestions([]); // Clear suggestions
    };

    return (
        <div className="w-full bg-white p-4 shadow">
            {/* Row 1: Titles */}
            <div className="flex justify-between mb-2">
                <h2 className="text-4xl font-bold text-[#033372]"><span className="text-[#FFBD59]">P</span>roducts</h2>
                <h2 className="text-4xl text-[#033372] font-bold">Universal Auto Supply <span className='text-[#FFBD59]'>and</span> Bolt Center</h2>
            </div>

            {/* Row 2: Sort by and Search box */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2 text-2xl font-semibold">Sort by:</label>
                    <CustomSelect value={sortOption} onChange={(value) => setSortOption(value)} />
                </div>
                <div className="relative w-1/3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(searchTerm.length > 0)} // Show suggestions if there's input
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay hiding suggestions slightly
                        placeholder="Search products..."
                        className="w-full p-4 rounded-lg text-3xl font-bold border border-gray-300 shadow uppercase pr-16"
                    />
                    <button onClick={clearSearch} className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <FaTimes size={40} className="text-gray-500" /> {/* Increased size */}
                    </button>
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-96 overflow-y-auto">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.product_id}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer text-4xl"
                                >
                                    {highlightMatch(suggestion.product_name, searchTerm)}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Topbar;