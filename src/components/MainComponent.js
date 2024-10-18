import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import UnifiedProductSelect from './UnifiedProductSelect';
import Feedback from './Feedback';
import Loader from './Loader';

const MainComponent = () => {
    const [token, setToken] = useState('');
    const [mainCategories, setMainCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [sortOption, setSortOption] = useState('name-asc'); // Added state for sort option

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

                const categoriesResponse = await fetch('http://localhost:8000/api/main-categories/', {
                    headers: { 'Authorization': `Token ${loginData.token}` },
                });
                if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
                const categoriesData = await categoriesResponse.json();
                setMainCategories(categoriesData);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loginAndFetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <Router>
            <div className="flex h-screen">
                <Sidebar
                    cart={cart}
                    setIsCartOpen={setIsCartOpen}
                    isCartOpen={isCartOpen}
                    token={token}
                    setCart={setCart}
                    mainCategories={mainCategories}
                    setSelectedMainCategory={setSelectedMainCategory}
                    setSelectedSubCategory={setSelectedSubCategory}
                />
                <div className="flex flex-col flex-grow h-screen bg-gray-100">
                    <Topbar
                        searchTerm={searchQuery}
                        setSearchTerm={setSearchQuery}
                        sortOption={sortOption} // Pass sortOption to Topbar
                        setSortOption={setSortOption} // Pass setSortOption to Topbar
                    />
                    <div className="flex-grow p-4 overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<UnifiedProductSelect
                                token={token}
                                cart={cart}
                                setCart={setCart}
                                selectedMainCategory={selectedMainCategory}
                                selectedSubCategory={selectedSubCategory}
                                searchQuery={searchQuery}
                                sortOption={sortOption} // Pass sortOption to UnifiedProductSelect
                            />} />
                            <Route path="/feedback" element={<Feedback />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default MainComponent;