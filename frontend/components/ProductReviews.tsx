import React, { useState } from 'react';
import { Review, User } from '../types';
import { StarIcon } from '../constants';

// Sửa 1: Thêm prop 'ratingCounts'
interface ProductReviewsProps {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
    ratingCounts: { rating: number; count: number }[]; // <-- THÊM PROP NÀY
    currentUser: User | null;
    onSubmitReview: (review: Omit<Review, 'id' | 'date'>) => void;
    onAuthClick: () => void;
}

const RatingBar: React.FC<{ rating: number; count: number; total: number }> = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gym-gray w-12">{rating} sao</span>
            <div className="w-full bg-gym-darker rounded-full h-2">
                <div className="bg-gym-yellow h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="text-sm text-white font-semibold w-8 text-right">{count}</span>
        </div>
    );
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ 
    reviews, 
    averageRating, 
    totalReviews, 
    ratingCounts, // <-- Nhận prop mới
    currentUser, 
    onSubmitReview, 
    onAuthClick 
}) => {
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    // Sửa 2: XÓA BỎ PHẦN TÍNH TOÁN NÀY (vì đã có prop)
    /*
    const ratingCounts = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    };
    */
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating === 0) {
            setError('Vui lòng chọn số sao để đánh giá.');
            return;
        }
        if (!comment.trim()) {
            setError('Vui lòng nhập nội dung nhận xét.');
            return;
        }
        
        onSubmitReview({
            author: currentUser!.name,
            rating: newRating,
            comment: comment.trim(),
        });
        
        // Reset form
        setNewRating(0);
        setComment('');
        setError('');
    };

    // Sửa 3: Thêm hàm helper để lấy count từ prop
    const getCountForRating = (rating: number): number => {
      const found = ratingCounts.find(rc => rc.rating === rating);
      return found ? found.count : 0;
    };

    return (
        <section className="bg-gym-dark p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3">Đánh giá & Nhận xét</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Summary */}
                <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-gym-gray">Đánh giá trung bình</p>
                    <p className="text-5xl font-extrabold text-gym-yellow my-2">{averageRating.toFixed(1)}/5</p>
                    <div className="flex text-gym-yellow mb-2">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-6 w-6 ${i < Math.round(averageRating) ? 'text-gym-yellow' : 'text-gray-600'}`} />
                        ))}
                    </div>
                    <p className="text-gym-gray">({totalReviews} đánh giá)</p>
                </div>

                {/* Sửa 4: Cập nhật Rating Breakdown để dùng hàm helper */}
                <div className="md:col-span-2 space-y-2">
                    <RatingBar rating={5} count={getCountForRating(5)} total={totalReviews} />
                    <RatingBar rating={4} count={getCountForRating(4)} total={totalReviews} />
                    <RatingBar rating={3} count={getCountForRating(3)} total={totalReviews} />
                    <RatingBar rating={2} count={getCountForRating(2)} total={totalReviews} />
                    <RatingBar rating={1} count={getCountForRating(1)} total={totalReviews} />
                </div>
            </div>

            {/* Review Form */}
            <div className="border-t border-gray-700 pt-8 mb-8">
                {currentUser ? (
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-xl font-bold text-white mb-4">Viết nhận xét của bạn</h3>
                        <div className="mb-4">
                            <p className="text-sm text-gym-gray mb-2">Bạn đánh giá sản phẩm này bao nhiêu sao?</p>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setNewRating(star)}
                                        className="focus:outline-none"
                                        aria-label={`Rate ${star} stars`}
                                    >
                                        <StarIcon className={`w-8 h-8 transition-colors ${(hoverRating >= star || newRating >= star) ? 'text-gym-yellow' : 'text-gray-600'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                             <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full bg-gym-darker border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                                placeholder={`Nhận xét của bạn về sản phẩm...`}
                            ></textarea>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <div className="text-right mt-4">
                            <button type="submit" className="bg-gym-yellow text-gym-darker font-bold py-2 px-6 rounded-md hover:bg-yellow-300 transition-colors">
                                Gửi đánh giá
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center p-6 bg-gym-darker rounded-lg">
                        <p className="text-gym-gray">
                            Vui lòng{' '}
                            <button onClick={onAuthClick} className="font-bold text-gym-yellow hover:underline">
                                đăng nhập
                            </button>
                            {' '}để để lại đánh giá của bạn.
                        </p>
                    </div>
                )}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                        <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gym-yellow rounded-full flex items-center justify-center font-bold text-gym-darker mr-3">
                                {review.author.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-white">{review.author}</p>
                                <p className="text-xs text-gym-gray">{review.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center my-2">
                             {[...Array(5)].map((_, i) => (
                                <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-gym-yellow' : 'text-gray-600'}`} />
                            ))}
                        </div>
                        <p className="text-gym-gray leading-relaxed">{review.comment}</p>
                    </div>
                )) : (
                    <p className="text-gym-gray text-center py-4">Chưa có đánh giá nào cho sản phẩm này.</p>
                )}
            </div>
        </section>
    );
};

export default ProductReviews;