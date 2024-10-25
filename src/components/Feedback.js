import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import BackgroundImage from '../img/Background/background.png';

const Feedback = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate
    const { order_id } = location.state || {}; // Retrieve order_id from state
    console.log('Received order_id:', order_id); // Debugging line

    const [rating, setRating] = useState(0); // Set the rating to 0 by default
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

    const handleSubmit = useCallback(async (rating) => {
        // Validate input before sending
        if (!order_id) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Order ID is required.',
                timer: 2000,
                showConfirmButton: false
            });
            return; // Exit early if validation fails
        }

        // Prevent multiple submissions
        if (isSubmitting) return;

        setIsSubmitting(true); // Set submitting state to true

        // Determine satisfaction based on rating
        let feedbackSatisfaction;
        if (rating >= 4) {
            feedbackSatisfaction = 'Satisfied';
        } else if (rating >= 2) {
            feedbackSatisfaction = 'Neutral';
        } else {
            feedbackSatisfaction = 'Not Satisfied';
        }

        // Prepare feedback data
        const feedbackData = {
            order_id: order_id, // Ensure this is the correct order ID
            feedback_rating: rating,
            feedback_satisfaction: feedbackSatisfaction
        };

        // Send the feedback to the server
        try {
            const response = await axios.post('http://localhost:8000/api/feedback/', feedbackData);
            if (response.status === 201) { // Check for successful creation
                Swal.fire({
                    icon: 'success',
                    title: 'Thank you for your feedback!',
                    text: 'Your feedback has been submitted successfully.',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/'); // Redirect to home page after success
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message || 'Failed to submit feedback. Please try again.',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error submitting feedback:', error.response.data); // Log the specific error response
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to submit feedback. Please try again.',
                timer: 2000,
                showConfirmButton: false
            });
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    }, [order_id, isSubmitting, navigate]); // Include dependencies

    useEffect(() => {
        // Set a timer to automatically submit a rating of 5 after 20 seconds
        const timer = setTimeout(() => {
            if (rating === 0) { // Only submit if no rating has been given
                handleSubmit(5); // Automatically submit a rating of 5
            }
        }, 20000); // 20 seconds

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, [rating, handleSubmit]); // Include handleSubmit in the dependency array

    const handleRatingChange = (rating) => {
        setRating(rating);
        handleSubmit(rating); // Automatically submit when a star is clicked
    };

    return (
        <div className="h-full bg-cover bg-center" style={{ backgroundImage: `url(${BackgroundImage})` }}>
            <div className="container mx-auto p-4 pt-6 flex flex-col justify-between items-center">
                <div className="text-center">
                    <h2 className="font-bold text-white my-24" style={{ fontSize: 100, lineHeight: 1.2 }}>
                        <span className="text-[#FFBD59]">H</span>ow <span className="text-[#FFBD59]">W</span>ould <span className="text-[#FFBD59]">Y</span>ou <span className="text-[#FFBD59]">R</span>ate <span className="text-[#FFBD59]">Y</span>our <span className="text-[#FFBD59]">E</span>xperience?
                    </h2>
                    <div className="flex justify-center">
                        {[1, 2, 3, 4, 5].map((ratingValue) => (
                            <button key={ratingValue} onClick={() => handleRatingChange(ratingValue)} className={`mx-2`}>
                                <FontAwesomeIcon
                                    icon={faStar}
                                    style={{ fontSize: 300, color: ratingValue <= rating ? '#FFBD59' : '#C4C4C4' }} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;