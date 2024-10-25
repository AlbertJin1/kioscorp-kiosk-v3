// MainComponent.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import UnifiedProductSelect from './UnifiedProductSelect';
import Feedback from './Feedback';
import Loader from './Loader';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Import background images
import screensaver1 from '../img/Screensaver/screensaver1.png';
import screensaver2 from '../img/Screensaver/screensaver2.png';
import screensaver3 from '../img/Screensaver/screensaver3.png';

const MainComponent = () => {
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [sortOption, setSortOption] = useState('name-asc');
    const [products, setProducts] = useState([]); // Lifted products state
    const [isScreensaverActive, setIsScreensaverActive] = useState(false);
    const [backgroundIndex, setBackgroundIndex] = useState(0);

    const location = useLocation();

    useEffect(() => {
        const loginAndFetchData = async () => {
            try {
                const loginResponse = await fetch('http://localhost:8000/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: 'owner',
                        password: 'password',
                    }),
                });
                if (!loginResponse.ok) throw new Error('Login failed');
                const loginData = await loginResponse.json();
                setToken(loginData.token);
                localStorage.setItem('token', loginData.token);

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Login successful!',
                    showConfirmButton: false,
                    timer: 1500,
                    backdrop: false,
                });

                const productsResponse = await fetch('http://localhost:8000/api/products/', {
                    headers: {
                        'Authorization': `Token ${loginData.token}`,
                    },
                });
                const productsData = await productsResponse.json();
                setProducts(productsData);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loginAndFetchData();

        // Inactivity timer logic
        let timeoutId;
        const handleUserActivity = () => {
            setIsScreensaverActive(false);
            clearTimeout(timeoutId);
            startInactivityTimer();
        };

        const startInactivityTimer = () => {
            timeoutId = setTimeout(() => {
                setIsScreensaverActive(true);
            }, 60000); // Activate screensaver after 60 seconds of inactivity
        };

        // Start the timer on component mount
        startInactivityTimer();

        // Event listeners for user activity
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);

        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            clearTimeout(timeoutId); // Clean up the timeout on unmount
        };
    }, []);

    // Background image transition logic
    useEffect(() => {
        if (isScreensaverActive) {
            const intervalId = setInterval(() => {
                setBackgroundIndex((prevIndex) => (prevIndex + 1) % 3); // Updated to use index directly
            }, 5000); // Change background every 3 seconds

            return () => clearInterval(intervalId); // Clean up the interval on unmount
        }
    }, [isScreensaverActive]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <div
            className={`flex h-screen ${isScreensaverActive ? 'screensaver' : ''}`}
            style={{
                backgroundImage: isScreensaverActive ? `url(${[screensaver1, screensaver2, screensaver3][backgroundIndex]})` : 'none',
                backgroundSize: 'cover',
                transition: 'background-image 1s ease-in-out',
            }}
        >
            <div className={`flex flex-col flex-grow h-screen bg-gray-100 ${isScreensaverActive ? 'hidden' : ''}`}>
                {location.pathname !== '/feedback' && (
                    <Topbar
                        searchTerm={searchQuery}
                        setSearchTerm={setSearchQuery}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        products={products}
                        token={token}
                    />
                )}
                <div className={`flex-grow overflow-y-auto ${location.pathname === '/feedback' ? '' : 'p-4'}`}>
                    <Routes>
                        <Route path="/" element={<UnifiedProductSelect
                            token={token}
                            cart={cart}
                            setCart={setCart}
                            setIsCartOpen={setIsCartOpen}
                            searchQuery={searchQuery}
                            sortOption={sortOption}
                            isCartOpen={isCartOpen}
                            products={products}
                            setProducts={setProducts}
                        />} />
                        <Route path="/feedback" element={<Feedback />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
