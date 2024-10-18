import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainCategorySelect = ({ token, mainCategories }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate('/sub-category', { state: { mainCategory: category.main_category_id } });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Select a Category</h2>
            <div className="grid grid-cols-2 gap-6">
                {mainCategories.map((category) => (
                    <button
                        key={category.main_category_id}
                        className="p-6 bg-white shadow-md hover:bg-gray-100"
                        onClick={() => handleCategoryClick(category)}
                    >
                        <h3 className="text-xl font-bold">{category.main_category_name}</h3>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MainCategorySelect;
