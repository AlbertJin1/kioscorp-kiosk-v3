import React from 'react';

const Topbar = ({ searchTerm, setSearchTerm, sortOption, setSortOption }) => {
    return (
        <div className="w-full bg-white p-4 shadow">
            {/* Row 1: Titles */}
            <div className="flex justify-between mb-2">
                <h2 className="text-3xl font-bold">Products</h2>
                <h2 className="text-2xl text-[#033372] font-bold">Universal Auto Supply <span className='text-[#FFBD59]'>and</span> Bolt Center</h2>
            </div>

            {/* Row 2: Sort by and Search box */}
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2 text-lg font-semibold">Sort by:</label>
                    <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-2 border border-gray-300 rounded text-xl font-bold"
                    >
                        <option value="name-asc" className="font-bold">Name Ascending</option>
                        <option value="name-desc" className="font-bold">Name Descending</option>
                        <option value="price-asc" className="font-bold">Price Low to High</option>
                        <option value="price-desc" className="font-bold">Price High to Low</option>
                    </select>
                </div>
                <div className="w-1/3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="w-full p-4 rounded-lg text-lg font-semibold border border-gray-300 shadow"
                    />
                </div>
            </div>
        </div>
    );
};

export default Topbar;
