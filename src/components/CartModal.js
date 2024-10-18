// CartModal.js
import React, { useState } from 'react';
import { IoMdRemoveCircleOutline, IoMdAddCircleOutline } from 'react-icons/io';
import Swal from 'sweetalert2';
import axios from 'axios';

const CartModal = ({ isCartOpen, setIsCartOpen, cart, setCart, token, navigate }) => {
    const [isPrinting, setIsPrinting] = useState(false);
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + item.product_price * item.quantity, 0);
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        const existingProduct = cart.find(item => item.product_id === productId);
        if (existingProduct) {
            setCart(prevCart => prevCart.map(item =>
                item.product_id === productId ? { ...item, quantity: newQuantity } : item
            ));
        } else {
            setCart(prevCart => [...prevCart, { product_id: productId, quantity: newQuantity }]);
        }
    };

    const handleRemoveFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
    };

    const handlePrint = async () => {
        if (isPrinting) return;
        setIsPrinting(true);

        try {
            // Your print logic here
            if (cart.length === 0) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Please add items to your cart before printing.',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    backdrop: false,
                });
                setIsPrinting(false);
                return;
            }

            const printData = {
                items: cart.map(item => ({
                    product: {
                        product_id: item.product_id,
                        product_name: item.product_name,
                        product_price: item.product_price
                    },
                    quantity: item.quantity,
                    price: item.product_price
                })),
                total: calculateTotal()
            };

            try {
                const response = await axios.post('http://localhost:8000/api/print-receipt/', printData, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'success',
                        title: 'Your receipt has been printed successfully.',
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        backdrop: false,
                    });
                    setCart([]);  // Clear the cart after successful print
                    setIsCartOpen(false);  // Close the cart modal
                } else {
                    throw new Error(response.data.message || 'Printing failed');
                }
            } catch (error) {
                console.error('Error printing receipt:', error);
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'There was an error printing the receipt. Please try again.',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    backdrop: false,
                });
            }
        } finally {
            setIsPrinting(false);
        }
    };

    return (
        isCartOpen && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col text-black">
                    <h2 className="text-5xl font-bold mb-4">Shopping Cart</h2>
                    <hr className="border-gray-300 mb-4" />
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-grow">
                            <p className="text-2xl text-gray-500 mb-4">Your cart is empty.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-3xl font-bold hover:bg-gray-400 transition duration-300"
                            >
                                CLOSE
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between mb-4 text-4xl font-bold text-gray-600">
                                <span className="w-1/6 text-center">Image</span>
                                <span className="w-1/3">Product Name</span>
                                <span className="w-1/4 text-center">Quantity</span>
                                <span className="w-1/4 text-center">Price</span>
                                <span className="w-1/6 text-center">Action</span>
                            </div>
                            <hr className="border-gray-300 mb-4" />
                            <div className="flex flex-col flex-grow overflow-y-auto">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center mb-4">
                                        <div className="w-1/6 flex justify-center">
                                            <img
                                                src={item.product_image
                                                    ? `http://localhost:8000${item.product_image}`
                                                    : "https://via.placeholder.com/150"
                                                }
                                                alt={item.product_name}
                                                className="h-20 w-20 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.onerror = null; // prevents looping
                                                    e.target.src = "https://via.placeholder.com/150";
                                                }}
                                            />
                                        </div>
                                        <span className="text-3xl font-bold w-1/3">{item.product_name}</span>
                                        <div className="flex items-center justify-center w-1/4">
                                            <button onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}>
                                                <IoMdRemoveCircleOutline className="text-5xl text-blue-500 hover:text-blue-700" />
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onInput={(e) => {
                                                    const newQuantity = e.target.value;
                                                    if (newQuantity === '') {
                                                        return;
                                                    }
                                                    const parsedQuantity = parseInt(newQuantity);
                                                    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
                                                        e.target.value = item.quantity;
                                                        return;
                                                    }
                                                    handleUpdateQuantity(item.product_id, parsedQuantity);
                                                }}
                                                min="1"
                                                className="w-16 font-bold text-2xl text-center border-2 border-gray-300 rounded p-2 mx-2 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}>
                                                <IoMdAddCircleOutline className="text-5xl text-blue-500 hover:text-blue-700" />
                                            </button>
                                        </div>
                                        <span className="text-3xl font-bold w-1/4 text-center">₱{item.product_price}</span>
                                        <button
                                            onClick={() => handleRemoveFromCart(item.product_id)}
                                            className="text-red-500 hover:text-red-700 w-1/6 flex justify-center text-3xl font-bold"
                                        >
                                            REMOVE
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <hr className="border-gray-300 mb-4" />
                            {/* Footer with Close, Total, and Print */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-3xl font-bold hover:bg-gray-400 transition duration-300"
                                >
                                    CLOSE
                                </button>
                                <div className="flex justify-center items-center">
                                    <span className="text-4xl font-bold mr-4">Total:</span>
                                    <span className="text-6xl font-bold">₱{calculateTotal()}</span>
                                </div>
                                <button
                                    onClick={handlePrint}
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg text-3xl font-bold hover:bg-blue-600 transition duration-300"
                                >
                                    PRINT
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    );
};

export default CartModal;