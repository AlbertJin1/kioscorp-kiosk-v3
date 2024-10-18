import React, { useState, useEffect } from 'react';
import { IoMdCart } from 'react-icons/io';
import CartModal from './CartModal';
import LogoImage from '../img/Logo/kioscorp.png';

const Sidebar = ({ cart, isCartOpen, setIsCartOpen, token, setCart, mainCategories, setSelectedMainCategory, setSelectedSubCategory }) => {
    const [subCategories, setSubCategories] = useState([]);
    const [selectedMainCategory, setSelectedMainCategoryState] = useState(null);
    const [selectedSubCategory, setSelectedSubCategoryState] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;  // Limit sub-categories per page

    useEffect(() => {
        const fetchSubCategories = async () => {
            if (selectedMainCategory) {
                const response = await fetch(`http://localhost:8000/api/sub-categories/?main_category=${selectedMainCategory}`, {
                    headers: { 'Authorization': `Token ${token}` },
                });
                const data = await response.json();
                setSubCategories(data);
                setCurrentPage(1);  // Reset to the first page when a new category is selected
            }
        };

        fetchSubCategories();
    }, [selectedMainCategory, token]);

    const handleMainCategorySelect = (category) => {
        setSelectedMainCategoryState(category === selectedMainCategory ? null : category);
        setSelectedSubCategoryState(null);
        setSelectedSubCategory(null); // Reset selected sub-category
    };

    const handleSubCategorySelect = (subCategory) => {
        setSelectedSubCategoryState(subCategory === selectedSubCategory ? null : subCategory);
        setSelectedSubCategory(subCategory);
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSubCategories = subCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(subCategories.length / itemsPerPage);

    // Change Page
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col bg-[#033372] text-white transition-all duration-300 w-72`}>
            {/* Logo Section */}
            <div className="flex items-center justify-center py-2 px-4">
                <img src={LogoImage} alt="Kioscorp Logo" className="w-56 h-auto object-cover" />
            </div>
            <hr className="border-gray-300 mt-2" />

            {/* Main Categories Filter */}
            <div>
                <h3 className="text-2xl font-bold px-4 py-2">Main Categories</h3>
                {mainCategories.map((category) => (
                    <button
                        key={category.main_category_id}
                        className={`w-full p-4 text-left text-lg font-semibold ${selectedMainCategory === category.main_category_id ? 'bg-[#022a5e]' : 'hover:bg-[#022a5e]'}`}
                        onClick={() => handleMainCategorySelect(category.main_category_id)}
                    >
                        {category.main_category_name} ({category.product_count})
                    </button>
                ))}
            </div>

            {/* Sub-Categories Filter */}
            <div>
                <h3 className="text-2xl font-bold px-4 py-2">Sub-Categories</h3>
                {currentSubCategories.map((subCategory) => (
                    <button
                        key={subCategory.sub_category_id}
                        className={`w-full p-4 text-left text-md font-semibold ${selectedSubCategory === subCategory.sub_category_id ? 'bg-[#022a5e]' : 'hover:bg-[#022a5e]'}`}
                        onClick={() => handleSubCategorySelect(subCategory.sub_category_id)}
                    >
                        {subCategory.sub_category_name} ({subCategory.product_count})
                    </button>
                ))}
            </div>

            {/* Footer Section with Pagination and Cart */}
            <div className="mt-auto p-4 flex flex-col">
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`p-2 px-4 text-lg font-bold ${currentPage === 1 ? 'bg-gray-400' : 'bg-[#022a5e] hover:bg-blue-700'} text-white rounded`}
                    >
                        Prev
                    </button>
                    <span>{currentPage} / {totalPages}</span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 px-4 text-lg font-bold ${currentPage === totalPages ? 'bg-gray-400' : 'bg-[#022a5e] hover:bg-blue-700'} text-white rounded`}
                    >
                        Next
                    </button>
                </div>

                {/* Clear All Button */}
                <button
                    className="w-full p-2 h-20 bg-red-600 text-3xl text-white font-bold rounded hover:bg-red-500 transition duration-300 mb-4"
                    onClick={() => {
                        setSelectedMainCategoryState(null);
                        setSelectedSubCategoryState(null);
                    }}
                >
                    Clear All
                </button>

                {/* Cart Icon */}
                <div className="relative cursor-pointer flex items-center space-x-2 p-2 h-20 bg-blue-600 hover:bg-blue-700 rounded transition duration-300" onClick={() => setIsCartOpen(true)}>
                    <IoMdCart size={50} className="text-yellow-400" />
                    <span className="text-4xl font-bold text-white flex items-center">
                        Cart
                        {cart.length > 0 && (
                            <div className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xl font-bold">
                                {cart.length}
                            </div>
                        )}
                    </span>
                </div>
            </div>

            {/* Cart Modal */}
            <CartModal
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                cart={cart}
                setCart={setCart}
                token={token}
            />
        </div>
    );
};

export default Sidebar;