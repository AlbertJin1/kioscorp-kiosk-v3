import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SubCategorySelect = ({ token, mainCategories }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { mainCategory } = location.state || {};
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        const fetchSubCategories = async () => {
            const response = await fetch(`http://localhost:8000/api/sub-categories/?main_category=${mainCategory}`, {
                headers: { 'Authorization': `Token ${token}` },
            });
            const data = await response.json();
            setSubCategories(data);
        };

        fetchSubCategories();
    }, [mainCategory, token]);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Select a Subcategory</h2>
            <div className="grid grid-cols-2 gap-6">
                {subCategories.map((subcategory) => (
                    <button
                        key={subcategory.sub_category_id}
                        className="p-6 bg-white shadow-md hover:bg-gray-100"
                        onClick={() => navigate('/products', { state: { subCategory: subcategory.sub_category_id } })}
                    >
                        <h3 className="text-xl font-bold">{subcategory.sub_category_name}</h3>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SubCategorySelect;
