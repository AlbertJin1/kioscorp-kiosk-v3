import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { IoMdCart } from 'react-icons/io';
import CartModal from './CartModal';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom';

const UnifiedProductSelect = ({ token, cart, setCart, isCartOpen, searchQuery, sortOption, setIsCartOpen }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
    const [currentSubCategoryPage, setCurrentSubCategoryPage] = useState(1);
    const subCategoriesPerPage = 5;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const mainCategoriesResponse = await fetch('http://localhost:8000/api/main-categories/', {
                    headers: { 'Authorization': `Token ${token}` },
                });
                const mainCategoriesData = await mainCategoriesResponse.json();
                setMainCategories(mainCategoriesData);

                const subCategoriesResponse = await fetch('http://localhost:8000/api/sub-categories/', {
                    headers: { 'Authorization': `Token ${token}` },
                });
                const subCategoriesData = await subCategoriesResponse.json();
                setSubCategories(subCategoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [token]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = 'http://localhost:8000/api/products/';
                const params = new URLSearchParams();
                if (selectedMainCategory) {
                    params.append('main_category', selectedMainCategory);
                }
                if (selectedSubCategory) {
                    params.append('sub_category', selectedSubCategory);
                }
                url += `?${params.toString()}`;
                const response = await fetch(url, {
                    headers: { 'Authorization': `Token ${token}` },
                });
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [token, selectedMainCategory, selectedSubCategory]);

    const filteredProducts = products.filter(product => {
        const matchesSearchQuery = product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.product_brand.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesMainCategory = selectedMainCategory
            ? subCategories.some(sub => sub.sub_category_id === product.sub_category && sub.main_category === selectedMainCategory)
            : true;

        const matchesSubCategory = selectedSubCategory ? product.sub_category === selectedSubCategory : true;

        return matchesSearchQuery && matchesMainCategory && matchesSubCategory;
    });

    // Sort the filtered products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === 'name-asc') {
            return a.product_name.localeCompare(b.product_name);
        } else if (sortOption === 'name-desc') {
            return b.product_name.localeCompare(a.product_name);
        } else if (sortOption === 'price-asc') {
            return a.product_price - b.product_price;
        } else if (sortOption === 'price-desc') {
            return b.product_price - a.product_price;
        }
        return 0;
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const currentProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

    const handleAddToCart = (product) => {
        const existingProduct = cart.find(item => item.product_id === product.product_id);
        if (existingProduct) {
            setCart(prevCart => prevCart.map(item =>
                item.product_id === product.product_id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
            ));
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Item added to cart',
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        } else {
            setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Item added to cart',
                showConfirmButton: false,
                timer: 1500,
                backdrop: false
            });
        }
    };

    // Sort the subCategories alphabetically (A-Z)
    const sortedSubCategories = subCategories.sort((a, b) =>
        a.sub_category_name.localeCompare(b.sub_category_name)
    );

    // Slice the sorted array for pagination
    const paginatedSubCategories = sortedSubCategories.slice(
        (currentSubCategoryPage - 1) * subCategoriesPerPage,
        currentSubCategoryPage * subCategoriesPerPage
    );

    return (
        <div className="flex h-full">
            <div className="w-1/4 p-4 bg-gray-200 h-full flex flex-col">
                {/* Add cart icon below subcategories */}
                <div className="flex flex-col">
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
                    navigate={navigate}
                />
                <h3 className="text-2xl font-bold text-left mt-4 mb-2">Filters</h3>
                <ul>
                    <li key="all" className="w-full">
                        <button
                            onClick={() => {
                                setSelectedMainCategory(null);
                                setSelectedSubCategory(null);
                            }}
                            className={`w-full p-4 text-2xl font-bold rounded transition duration-300 text-left ${selectedMainCategory === null && selectedSubCategory === null ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                        >
                            Show All
                        </button>
                    </li>
                </ul>
                <div className="mt-4">
                    <h4 className="text-2xl font-bold mb-4 text-left">Main Categories</h4>
                    <ul>

                        {mainCategories.map((category) => (
                            <li key={category.main_category_id} className="w-full">
                                <button
                                    onClick={() => {
                                        if (selectedMainCategory === category.main_category_id) {
                                            setSelectedMainCategory(null);
                                            setSelectedSubCategory(null);
                                        } else {
                                            setSelectedMainCategory(category.main_category_id);
                                            setSelectedSubCategory(null);
                                        }
                                    }}
                                    className={`w-full p-4 text-2xl font-bold rounded transition duration-300 text-left ${selectedMainCategory === category.main_category_id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    {category.main_category_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <button
                                onClick={() => setCurrentSubCategoryPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentSubCategoryPage === 1}
                                className={`px-4 py-2 rounded-l text-2xl font-bold transition duration-300 ${currentSubCategoryPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setCurrentSubCategoryPage(prev => Math.min(prev + 1, Math.ceil(subCategories.length / subCategoriesPerPage)))}
                                disabled={currentSubCategoryPage === Math.ceil(subCategories.length / subCategoriesPerPage)}
                                className={`px-4 py-2 rounded-r text-2xl font-bold transition duration-300 ${currentSubCategoryPage === Math.ceil(subCategories.length / subCategoriesPerPage) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                            >
                                Next
                            </button>
                        </div>
                        <span className="mx-2 text-2xl font-bold text-gray-600">
                            Page {currentSubCategoryPage} of {Math.ceil(subCategories.length / subCategoriesPerPage)}
                        </span>
                    </div>
                </div>
                <div className="mt-4 flex-grow">
                    <h4 className="text-2xl font-bold mb-4 text-left">Sub Categories</h4>
                    <ul>
                        {paginatedSubCategories.map((subCategory) => (
                            <li key={subCategory.sub_category_id} className="w-full">
                                <button
                                    onClick={() => {
                                        if (selectedSubCategory === subCategory.sub_category_id) {
                                            setSelectedSubCategory(null);
                                            setSelectedMainCategory(null);
                                        } else {
                                            setSelectedSubCategory(subCategory.sub_category_id);
                                            setSelectedMainCategory(null);
                                        }
                                    }}
                                    className={`w-full p-4 text-2xl font-bold rounded transition duration-300 text-left ${selectedSubCategory === subCategory.sub_category_id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    {subCategory.sub_category_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Product Display Section */}
            <div className="flex-grow pl-4">
                {/* Pagination and product display logic */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-2xl font-bold">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`flex items-center px-4 py-2 rounded transition text-4xl duration-300 ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                        >
                            <FaChevronLeft size={50} />
                            Prev
                        </button>
                        <span className="text-gray-600 text-4xl">{`Page ${currentPage} of ${totalPages}`}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`flex items-center px-4 py-2 rounded transition text-4xl duration-300 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                        >
                            Next
                            <FaChevronRight size={50} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    {currentProducts.length === 0 ? (
                        <p className="col-span-3 text-center font-bold text-xl text-gray-600">No products found.</p>
                    ) : (
                        currentProducts.map((product) => (
                            <div key={product.product_id} className="flex p-6 bg-white shadow-md text-center rounded-lg">
                                <div className="flex-shrink-0">
                                    <img
                                        src={product.product_image ? `http://localhost:8000${product.product_image}` : "https://via.placeholder.com/150"}
                                        alt={product.product_name}
                                        className="w-auto h-40 object-cover border-2 border-black rounded-md"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevents looping
                                            e.target.src = "https://via.placeholder.com/150"; // Placeholder image
                                        }}
                                    />
                                </div>
                                <div className="flex-grow flex flex-col justify-between ml-6">
                                    <div>
                                        <h3 className="text-2xl font-bold">{product.product_name}</h3>
                                        <p className="text-gray-600 text-lg">{product.product_type}</p>
                                        <p className="text-2xl font-bold">₱{product.product_price}</p>
                                    </div>
                                    <button
                                        onClick={product.product_quantity > 0 ? () => handleAddToCart(product) : null}
                                        className={`transition duration-300 ${product.product_quantity === 0 ? 'bg-red-400 text-white cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'} text-3xl font-bold h-14 px-4 rounded mt-2`}
                                        disabled={product.product_quantity === 0} // Disable button if out of stock
                                    >
                                        {product.product_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnifiedProductSelect;