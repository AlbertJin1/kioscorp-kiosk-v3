import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Importing icons from react-icons

const UnifiedProductSelect = ({ token, cart, setCart, selectedMainCategory, selectedSubCategory, searchQuery, sortOption }) => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9; // 6 products per page

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(`http://localhost:8000/api/products/?main_category=${selectedMainCategory}&sub_category=${selectedSubCategory}`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, [selectedMainCategory, selectedSubCategory, token]);

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.product_brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        } else {
            setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
        }
    };

    return (
        <div>
            {/* Updated Pagination Logic */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-2xl font-bold">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={`flex items-center px-4 py-2 rounded transition duration-300 ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                        disabled={currentPage === 1}
                    >
                        <FaChevronLeft size={20} />
                        Prev
                    </button>
                    <span className="text-gray-600">{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={`flex items-center px-4 py-2 rounded transition duration-300 ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <FaChevronRight size={20} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
                {currentProducts.map((product) => (
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
                                <h3 className="text-lg font-bold">{product.product_name}</h3>
                                <p className="text-gray-600">{product.product_type}</p>
                                <p className="text-lg font-bold">₱{product.product_price}</p>
                            </div>
                            <button onClick={() => handleAddToCart(product)} className="transition duration-300 bg-blue-500 hover:bg-blue-700 text-white text-3xl font-bold h-14 px-4 rounded mt-2">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UnifiedProductSelect;