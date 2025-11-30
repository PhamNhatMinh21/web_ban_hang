// File: src/components/ProductPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { Product, User, Review } from '../types';
import { useCart } from '../contexts/CartContext';
import ProductReviews from './ProductReviews';

// Icon Ngôi Sao
const StarIcon: React.FC<{ className?: string, filled?: boolean }> = ({ className, filled }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    className={className || `w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-600'}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={filled ? 0 : 1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

interface RatingCount {
  rating: number;
  count: number;
}
interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingCounts: RatingCount[];
}

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  currentUser: User | null;
  onAuthClick: () => void;
  onStockSubscribe: (productId: number, email: string) => void;
  onCategorySelect: (category: string) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({
  product,
  onBack,
  currentUser,
  onAuthClick,
  onStockSubscribe
}) => {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const availableSizes = product.sizes || [];
  const availableFlavors = product.flavors || [];
  const finalSizes = availableSizes;
  const finalFlavors = availableFlavors;
  
  const [selectedSize, setSelectedSize] = useState(finalSizes[0] || '');
  const [selectedFlavor, setSelectedFlavor] = useState(finalFlavors[0] || '');

  const [notificationEmail, setNotificationEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // 👇 LOGIC QUYẾT ĐỊNH NHÃN HIỂN THỊ (THÔNG MINH)
  const isAccessory = product.category === 'Phụ kiện' || product.category.toLowerCase().includes('phụ kiện');
  const flavorLabel = isAccessory ? 'MÀU SẮC' : 'HƯƠNG VỊ';
  const sizeLabel = isAccessory ? 'KÍCH CỠ / DUNG TÍCH' : 'TRỌNG LƯỢNG / SIZE';

  // 1. Tự động đổi ảnh khi chọn biến thể
  useEffect(() => {
    const matchedVariant = product.variants?.find(v => 
        v.flavor === selectedFlavor && v.size === selectedSize
    );

    if (matchedVariant && matchedVariant.imageUrl && matchedVariant.imageUrl.trim() !== '') {
        setMainImage(matchedVariant.imageUrl);
    } else {
        setMainImage(product.images[0]);
    }
  }, [selectedFlavor, selectedSize, product]);

  // 2. Tính toán giá (đã fix logic giảm giá ngược)
  const currentVariant = product.variants?.find(v => v.flavor === selectedFlavor && v.size === selectedSize);
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentOldPrice = currentVariant ? (currentVariant.oldPrice || undefined) : product.oldPrice;
  const currentStock = currentVariant ? currentVariant.stockQuantity : product.stockQuantity;
  const isOutOfStock = currentStock <= 0;

  const discountPercent = (currentOldPrice && currentOldPrice > currentPrice)
      ? Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)
      : 0;

  useEffect(() => {
    if (currentUser) {
      const mockEmail = currentUser.name.toLowerCase().replace(/\s+/g, '.') + '@example.com';
      setNotificationEmail(mockEmail);
    } else {
      setNotificationEmail('');
    }
    setIsSubscribed(false);
  }, [currentUser, product.id]);

  const fetchReviewData = useCallback(async () => {
    if (!product.id) return;

    setIsLoadingReviews(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        api.get(`/reviews/product/${product.id}/stats`),
        api.get(`/reviews/product/${product.id}`)
      ]);
      setReviewStats(statsRes.data);
      setReviewList(listRes.data);
    } catch (err) {
      console.error("Failed to load review data", err);
      setReviewStats({ averageRating: 0, totalReviews: 0, ratingCounts: [] });
      setReviewList([]);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [product.id]);

  useEffect(() => {
    fetchReviewData();
  }, [fetchReviewData]);

  const handleReviewSubmit = async (review: Omit<Review, 'id' | 'date'>) => {
    if (!currentUser) {
        onAuthClick(); 
        return;
    }
    try {
      await api.post(`/reviews/product/${product.id}`, {
        rating: review.rating,
        comment: review.comment
      });
      alert('Gửi đánh giá thành công!');
      fetchReviewData(); 
    } catch (err: any) {
      console.error("Lỗi khi gửi đánh giá:", err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message;
      alert('Lỗi khi gửi đánh giá: ' + errorMessage);
    }
  };

  const handleAddToCart = async () => {
    if (isAdding || !product.inStock) return;
    if (!currentVariant) {
        alert('Biến thể sản phẩm này không tồn tại hoặc đã hết hàng. Vui lòng chọn lại.');
        return;
    }
    if (currentVariant.stockQuantity < quantity) {
        alert('Số lượng tồn kho không đủ.');
        return;
    }
    setIsAdding(true);
    try {
      await addToCart(currentVariant.sku, quantity);
      alert('Đã thêm vào giỏ hàng!');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi thêm vào giỏ');
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubscriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notificationEmail.trim() && product) {
      onStockSubscribe(product.id, notificationEmail);
      setIsSubscribed(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={onBack} className="text-sm text-gym-gray hover:text-gym-yellow mb-6">
        &larr; Quay lại cửa hàng
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image Section */}
        <div>
          <div className="border border-gray-800 rounded-lg overflow-hidden mb-4 relative">
            <img src={mainImage} alt={product.name} className="w-full h-auto object-cover aspect-square" />
            {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10">
                    -{discountPercent}%
                </span>
            )}
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setMainImage(img)} className={`w-20 h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 ${mainImage === img ? 'border-gym-yellow' : 'border-gray-800'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>

          {isLoadingReviews ? (
            <div className="h-5 w-48 bg-gray-800 rounded animate-pulse mb-4"></div>
          ) : (
            <div className="flex items-center mb-4">
              <div className="flex text-gym-yellow">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < Math.round(reviewStats?.averageRating || 0)} className="w-5 h-5" />
                ))}
              </div>
              <span className="text-sm text-gym-gray ml-2">({reviewStats?.totalReviews || 0} đánh giá)</span>
              <span className="mx-2 text-gym-gray">|</span>
              <span className={`text-sm ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
                {product.inStock ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </div>
          )}

          <div className="flex items-end gap-3 mb-6">
            <p className="text-3xl font-bold text-gym-yellow">
                {currentPrice.toLocaleString('vi-VN')}₫
            </p>
            {discountPercent > 0 && currentOldPrice && (
              <p className="text-xl text-gray-500 line-through font-medium pb-1">
                {currentOldPrice.toLocaleString('vi-VN')}₫
              </p>
            )}
          </div>

          {/* Chọn Thuộc tính 1 (Hương vị / Màu sắc) */}
          {finalFlavors.length > 0 && finalFlavors[0] !== 'Mặc định' && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gym-gray uppercase mb-2">
                {flavorLabel}: <span className="text-white font-bold">{selectedFlavor}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {finalFlavors.map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFlavor(f)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedFlavor === f
                      ? 'bg-gym-yellow text-gym-darker border-gym-yellow'
                      : 'bg-transparent text-white border-gray-700 hover:border-gym-yellow'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chọn Thuộc tính 2 (Size / Dung tích) */}
          {finalSizes.length > 0 && finalSizes[0] !== 'Standard' && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gym-gray uppercase mb-2">
                {sizeLabel}: <span className="text-white font-bold">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {finalSizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedSize === s
                      ? 'bg-gym-yellow text-gym-darker border-gym-yellow'
                      : 'bg-transparent text-white border-gray-700 hover:border-gym-yellow'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-gray-700 rounded-md">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 text-lg font-bold">-</button>
              <span className="px-6 py-3 text-lg font-bold">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-3 text-lg font-bold">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || !product.inStock}
              className="flex-grow bg-gym-yellow text-gym-darker font-bold py-3 px-8 rounded-md hover:bg-yellow-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Đang thêm...' : (product.inStock ? 'Thêm vào giỏ' : 'Hết hàng')}
            </button>
          </div>

          {!product.inStock && (
            <div className="mt-6 bg-gym-darker border border-gray-800 rounded-lg p-4 animate-fade-in">
              {isSubscribed ? (
                <div className="text-center">
                  <p className="font-bold text-green-400">Đăng ký thành công!</p>
                  <p className="text-sm text-gym-gray mt-1">
                    Chúng tôi sẽ gửi email cho bạn tại <span className="font-semibold text-white">{notificationEmail}</span> ngay khi có hàng trở lại.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-white text-center">Nhận thông báo khi có hàng</h3>
                  <p className="text-sm text-gym-gray text-center mt-1 mb-4">
                    Nhập email của bạn để chúng tôi thông báo ngay khi có hàng trở lại.
                  </p>
                  <form onSubmit={handleSubscriptionSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="email"
                      value={notificationEmail}
                      onChange={(e) => setNotificationEmail(e.target.value)}
                      placeholder="Nhập địa chỉ email của bạn"
                      required
                      className="flex-grow w-full bg-gym-dark border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                    />
                    <button type="submit" className="w-full sm:w-auto bg-gym-yellow text-gym-darker font-bold py-3 px-6 rounded-md hover:bg-yellow-300 transition-colors">
                      Đăng ký
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-bold text-white border-b border-gray-800 pb-2 mb-4">Mô tả sản phẩm</h3>
            <p className="text-gym-gray whitespace-pre-line">
                {product.description || 'Sản phẩm chưa có mô tả.'}
            </p>
          </div>
        </div>
      </div>

      {isLoadingReviews ? (
        <div className="text-center p-10 text-gym-gray">Đang tải đánh giá...</div>
      ) : (
        <ProductReviews
          reviews={reviewList} 
          averageRating={reviewStats?.averageRating || 0} 
          totalReviews={reviewStats?.totalReviews || 0} 
          ratingCounts={reviewStats?.ratingCounts || []} 
          currentUser={currentUser}
          onSubmitReview={handleReviewSubmit}
          onAuthClick={onAuthClick}
        />
      )}
    </div>
  );
};

export default ProductPage;