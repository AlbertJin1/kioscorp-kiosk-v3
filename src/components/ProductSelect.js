import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProductSelect = ({ token, searchTerm, cart, setCart }) => {
    const location = useLocation();
    const { subCategory } = location.state || {};
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch(`http://localhost:8000/api/products/?sub_category=${subCategory}`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            const data = await response.json();
            setProducts(data);
        };

        fetchProducts();
    }, [subCategory, token]);

    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <h2 className="text-3xl font-bold mb-6">Select a Product</h2>
            <div className="grid grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.product_id} className="p-6 bg-white shadow-md hover:bg-gray-100">
                        <h3 className="text-xl font-bold">{product.product_name}</h3>
                        <p>{product.product_price}</p>
                        <button
                            className="mt-4 p-2 bg-blue-500 text-white rounded"
                            onClick={() => handleAddToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSelect;